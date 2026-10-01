



import React from "react";
import { Link } from "react-router-dom";
import "./Footer.css";

const Footer = () => (
  <footer className="sd-footer">
    <div className="container">
      <div className="row g-4">
        <div className="col-md-3">
          <h5>Snapdeal</h5>
          <p>
            Shop smart. Discover great deals across fashion, electronics,
            home and more.
          </p>
        </div>

        <div className="col-md-3">
          <h6>Shop</h6>
          <Link to="/category/mens-fashion">Men's Fashion</Link>
          <Link to="/category/womens-fashion">Women's Fashion</Link>
          <Link to="/category/electronics">Electronics</Link>
          <Link to="/category/home-kitchen">Home & Kitchen</Link>
        </div>

        <div className="col-md-3">
          <h6>Customer Care</h6>
          <Link to="/orders">My Orders</Link>
          <Link to="/wishlist">Wishlist</Link>
          <Link to="/cart">My Cart</Link>
          <Link to="/login">Login</Link>
        </div>

        <div className="col-md-3">
          <h6>Follow Us</h6>

          <div className="footer-social">
            <i className="bi bi-facebook" />
            <i className="bi bi-instagram" />
            <i className="bi bi-twitter-x" />
            <i className="bi bi-youtube" />
          </div>
        </div>
      </div>

      <hr />

      <div className="text-center small">
        © 2026 Snapdeal Clone. Demo e-commerce project.
      </div>
    </div>
  </footer>
);

export default Footer;