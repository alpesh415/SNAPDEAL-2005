import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./Cart.css";
const Cart = () => {
  const navigate = useNavigate();
  const {
    cart,
    cartTotal,
    cartCount,
    increaseQuantity,
    decreaseQuantity,
    removeFromCart,
  } = useAppContext();
  if (!cart.length)
    return (
      <div className="empty-cart">
        <div className="empty-cart-icon">🛒</div>
        <h2>Your Cart is Empty</h2>
        <p>Add some products to your cart.</p>
        <button onClick={() => navigate("/")}>Continue Shopping</button>
      </div>
    );
  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-products">
          <div className="cart-heading">
            <h2>Shopping Cart</h2>
            <span>{cartCount} item(s)</span>
          </div>
          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.image} alt={item.title} />
              <div className="cart-item-info">
                <h5>{item.title}</h5>
                <p>₹{item.price}</p>
                <div className="quantity-controls">
                  <button onClick={() => decreaseQuantity(item.id)}>−</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>
              </div>
              <div className="cart-item-total">
                ₹{item.price * item.quantity}
                <button onClick={() => removeFromCart(item.id)}>Remove</button>
              </div>
            </div>
          ))}
          <button className="continue-shopping" onClick={() => navigate("/")}>
            ← Continue Shopping
          </button>
        </div>
        <aside className="cart-summary">
          <h3>Order Summary</h3>
          <div>
            <span>Items</span>
            <strong>{cartCount}</strong>
          </div>
          <div>
            <span>Subtotal</span>
            <strong>₹{cartTotal}</strong>
          </div>
          <div>
            <span>Delivery</span>
            <strong className="text-success">FREE</strong>
          </div>
          <hr />
          <div className="grand-total">
            <span>Total</span>
            <strong>₹{cartTotal}</strong>
          </div>
          <button onClick={() => navigate("/checkout")}>
            Proceed to Checkout
          </button>
        </aside>
      </div>
    </div>
  );
};
export default Cart;
