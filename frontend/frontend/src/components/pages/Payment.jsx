import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import api from "../services/api";

const RAZORPAY_CHECKOUT_URL = "https://checkout.razorpay.com/v1/checkout.js";

const loadRazorpay = () =>
  new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = RAZORPAY_CHECKOUT_URL;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Payment = () => {
  const navigate = useNavigate();
  const { cart, cartTotal, user, clearCart } = useAppContext();

  const [method, setMethod] = useState("razorpay");
  const [loading, setLoading] = useState(false);

  if (!cart.length) {
    return (
      <div className="empty-cart">
        <h2>No items to pay for</h2>
        <button onClick={() => navigate("/cart")}>Go to Cart</button>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="empty-cart">
        <h2>Please login to continue</h2>
        <button onClick={() => navigate("/login")}>Login</button>
      </div>
    );
  }

  const finishOrder = async () => {
    await clearCart();
    localStorage.removeItem("checkoutAddress");
    localStorage.removeItem("checkoutDetails");
    navigate("/orders?success=1");
  };

  const payWithRazorpay = async (orderId, userId) => {
    const loaded = await loadRazorpay();

    if (!loaded) {
      throw new Error("Razorpay checkout could not be loaded. Check your internet connection.");
    }

    const data = await api.payments.createRazorpayOrder({
      userId,
      orderId,
    });

    return new Promise((resolve, reject) => {
      const options = {
        key: data.key,
        amount: data.razorpayOrder.amount,
        currency: data.razorpayOrder.currency,
        name: "Snapdeal Clone",
        description: `Payment for order ${orderId}`,
        order_id: data.razorpayOrder.id,
        prefill: {
          name: user.username || "",
          email: user.email || "",
          contact: localStorage.getItem("checkoutDetails")
            ? JSON.parse(localStorage.getItem("checkoutDetails")).phone || ""
            : "",
        },
        theme: {
          color: "#e40046",
        },
        handler: async (response) => {
          try {
            await api.payments.verifyRazorpay({
              userId,
              orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            resolve();
          } catch (error) {
            reject(error);
          }
        },
        modal: {
          ondismiss: () => {
            reject(new Error("Payment was cancelled."));
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on("payment.failed", (response) => {
        reject(
          new Error(
            response?.error?.description || "Razorpay payment failed."
          )
        );
      });

      razorpay.open();
    });
  };

  const place = async (e) => {
    e.preventDefault();
    setLoading(true);

    const userId = user.id || user._id;
    const address = localStorage.getItem("checkoutAddress") || "";

    try {
      // Create the application order first. Stock/cart are finalized only
      // after COD confirmation or successful Razorpay signature verification.
      const orderData = await api.orders.create({ userId, address });
      const orderId = orderData.order._id;

      if (method === "cod") {
        await api.payments.create({
          userId,
          orderId,
          paymentMethod: "cod",
        });
      } else {
        await payWithRazorpay(orderId, userId);
      }

      await finishOrder();
    } catch (err) {
      alert(err.message || "Could not complete payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="payment-page"
      style={{
        padding: "40px 20px",
        background: "#f5f5f5",
        minHeight: "70vh",
      }}
    >
      <div
        className="payment-card"
        style={{
          maxWidth: 700,
          margin: "auto",
          background: "#fff",
          padding: 30,
          borderRadius: 8,
        }}
      >
        <h2>Choose Payment Method</h2>

        <div style={{ display: "grid", gap: 12, margin: "20px 0" }}>
          <label
            style={{
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="payment"
              checked={method === "razorpay"}
              onChange={() => setMethod("razorpay")}
            />{" "}
            <strong>Razorpay</strong>
            <small
              style={{ display: "block", marginLeft: 22, color: "#777" }}
            >
              Pay securely using UPI, Card, Netbanking or Wallet
            </small>
          </label>

          <label
            style={{
              border: "1px solid #ddd",
              padding: 16,
              borderRadius: 6,
              cursor: "pointer",
            }}
          >
            <input
              type="radio"
              name="payment"
              checked={method === "cod"}
              onChange={() => setMethod("cod")}
            />{" "}
            <strong>Cash on Delivery</strong>
            <small
              style={{ display: "block", marginLeft: 22, color: "#777" }}
            >
              Pay when your order arrives
            </small>
          </label>
        </div>

        <h4>Total: ₹{cartTotal}</h4>

        <form onSubmit={place}>
          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: 14,
              border: 0,
              borderRadius: 5,
              background: "#e40046",
              color: "#fff",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
            }}
          >
            {loading
              ? "Processing..."
              : method === "razorpay"
              ? `Pay ₹${cartTotal} with Razorpay`
              : "Place COD Order"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Payment;
