


import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./Checkout.css";

const Checkout = () => {
  const navigate = useNavigate();

  const { cart, cartTotal, user } = useAppContext();

  const [formData, setFormData] = useState({
    name: user?.username || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
  });

  
  if (!cart.length) {
    return (
      <div className="empty-cart">
        <h2>Your cart is empty</h2>

        <button onClick={() => navigate("/")}>
          Shop Now
        </button>
      </div>
    );
  }


  if (!user) {
    return (
      <div className="empty-cart">
        <h2>Please login to continue</h2>

        <button onClick={() => navigate("/login")}>
          Login
        </button>
      </div>
    );
  }


  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();

    
    localStorage.setItem(
      "checkoutDetails",
      JSON.stringify(formData)
    );

  
    const fullAddress = `${formData.name}, ${formData.address}, ${formData.city}, ${formData.state} - ${formData.pincode}. Phone: ${formData.phone}`;

    localStorage.setItem("checkoutAddress", fullAddress);

   
    navigate("/payment");
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">

     
        <div className="checkout-form">
          <h2>Delivery Details</h2>

          {user && (
            <p className="text-muted">
              Welcome, <strong>{user.username}</strong>
            </p>
          )}

          <form onSubmit={handleSubmit}>

            
            <label>
              Full Name

              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </label>

         
            <label>
              Email Address

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="example@gmail.com"
                required
              />
            </label>

            
            <label>
              Mobile Number

              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter 10 digit mobile number"
                maxLength="10"
                pattern="[0-9]{10}"
                required
              />
            </label>

           
            <label>
              Full Address

              <textarea
                name="address"
                rows="4"
                value={formData.address}
                onChange={handleChange}
                placeholder="House no, street, area"
                required
              />
            </label>

            
            <div className="row g-3">

              <div className="col-md-6">
                <label>
                  City

                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="Enter city"
                    required
                  />
                </label>
              </div>

              <div className="col-md-6">
                <label>
                  State

                  <input
                    type="text"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="Enter state"
                    required
                  />
                </label>
              </div>

            </div>

          
            <label>
              Pincode

              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="Enter 6 digit pincode"
                maxLength="6"
                pattern="[0-9]{6}"
                required
              />
            </label>

            <button type="submit">
              Continue to Payment
            </button>

          </form>
        </div>

       
        <aside className="checkout-summary">
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div
              className="checkout-line"
              key={item.id}
            >
              <span>
                {item.title} × {item.quantity}
              </span>

              <strong>
                ₹{item.price * item.quantity}
              </strong>
            </div>
          ))}

          <hr />

          <div className="checkout-total">
            <span>Total</span>

            <strong>
              ₹{cartTotal}
            </strong>
          </div>
        </aside>

      </div>
    </div>
  );
};

export default Checkout;