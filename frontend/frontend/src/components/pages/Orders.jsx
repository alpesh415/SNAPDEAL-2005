import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import api from "../services/api";

const Orders = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAppContext();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = user?.id || user?._id;

    if (!userId) {
      setLoading(false);
      return;
    }

    (async () => {
      try {
        setLoading(true);
        const data = await api.orders.getMine(userId);
        setOrders(data.orders || []);
      } catch (err) {
        console.error("Failed to load orders:", err.message);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    })();
  }, [user]);

  if (!user) {
    return (
      <div
        style={{
          minHeight: "70vh",
          background: "#f5f5f5",
          padding: "35px 20px",
          textAlign: "center",
        }}
      >
        <div
          style={{
            background: "#fff",
            padding: 70,
            maxWidth: 500,
            margin: "40px auto",
          }}
        >
          <h3>Please login to view your orders</h3>

          <button
            className="btn btn-danger mt-3"
            onClick={() => navigate("/login")}
          >
            Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        minHeight: "70vh",
        background: "#f5f5f5",
        padding: "35px 20px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "auto" }}>
        <div
          style={{
            background: "#fff",
            padding: 20,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <h2>My Orders</h2>

          <Link to="/" className="btn btn-danger">
            Continue Shopping
          </Link>
        </div>

        {location.search && (
          <div className="alert alert-success">
            Order placed successfully! Thank you for shopping.
          </div>
        )}

        {loading ? (
          <div
            style={{
              background: "#fff",
              padding: 70,
              textAlign: "center",
            }}
          >
            Loading your orders...
          </div>
        ) : orders.length === 0 ? (
          <div
            style={{
              background: "#fff",
              padding: 70,
              textAlign: "center",
            }}
          >
            <h3>No Orders Found</h3>

            <p>You haven't placed any orders yet.</p>

            <Link className="btn btn-danger" to="/">
              Start Shopping
            </Link>
          </div>
        ) : (
          orders.map((order) => (
            <div
              key={order._id}
              style={{
                background: "#fff",
                padding: 20,
                marginBottom: 20,
                border: "1px solid #eee",
              }}
            >
              <div className="d-flex justify-content-between flex-wrap gap-2">
                <strong>Order ID: {order._id}</strong>

                <span>
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <hr />

              <div>
                <strong>Status:</strong> {order.status}
                &nbsp;
                <strong>Payment:</strong> {order.paymentStatus}
              </div>

              <div className="text-muted mt-1" style={{ fontSize: 13 }}>
                {order.address}
              </div>

              {order.products.map((item) => (
                <div
                  key={item.product?._id || item._id}
                  className="d-flex justify-content-between border-bottom py-3"
                >
                  <span>
                    {item.product?.name || "Product"} × {item.quantity}
                  </span>

                  <strong>₹{item.price * item.quantity}</strong>
                </div>
              ))}

              <div className="text-end pt-3">
                <strong>Total: ₹{order.totalAmount}</strong>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Orders;
