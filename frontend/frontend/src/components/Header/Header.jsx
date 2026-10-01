import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import "./Header.css";

const Header = () => {
  const navigate = useNavigate();
  const { cartCount, user, logout } = useAppContext();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const submitSearch = (e) => {
    e.preventDefault();
    navigate(query.trim() ? `/search?q=${encodeURIComponent(query.trim())}` : "/");
  };

  return (
    <header className="sd-header">
      <div className="sd-topbar"><div className="container-fluid px-4 px-lg-5"><div className="row align-items-center"><div className="col-lg-6"><div className="sd-top-left"><span className="sd-offer">FREE Delivery</span><span className="sd-divider" /><span className="sd-offer">7 Days Easy Returns</span><span className="sd-divider" /><span className="sd-offer">Best Prices</span></div></div><div className="col-lg-6"><div className="sd-top-right"><span className="sd-top-item">Our Blog</span><span className="sd-top-item">Help Center</span><span className="sd-top-item">Sell on Snapdeal</span></div></div></div></div></div>
      <div className="sd-main-header"><div className="container-fluid px-4 px-lg-5"><div className="row align-items-center g-2">
        <div className="col-xl-2 col-lg-2 col-md-3 col-6"><Link to="/" className="sd-logo text-decoration-none"><div className="sd-logo-shape"><span /></div><span className="sd-logo-text">snapdeal</span></Link></div>
        <div className="col-xl-6 col-lg-5 col-md-5 col-12 order-md-2 order-3"><form className="sd-search" onSubmit={submitSearch}><i className="bi bi-search" /><input value={query} onChange={(e) => setQuery(e.target.value)} type="search" placeholder="Search for Brands & Products" aria-label="Search products" /></form></div>
        <div className="col-xl-1 col-lg-1 col-md-1 col-4 order-md-3 order-2"><button className="sd-action border-0 bg-transparent w-100" onClick={() => user ? setMenuOpen(!menuOpen) : navigate("/login")}><i className="bi bi-person-circle" /><span>{user ? user.username : "Login"}</span></button></div>
        <div className="col-xl-1 col-lg-1 col-md-1 col-4 order-md-4 order-2"><button className="sd-action border-0 bg-transparent w-100 position-relative" onClick={() => navigate("/cart")}><i className="bi bi-cart3" /><span>My Cart</span>{cartCount > 0 && <b className="cart-badge">{cartCount}</b>}</button></div>
        <div className="col-xl-2 col-lg-3 col-md-3 col-4 order-md-5 order-2">
          <div className="sd-header-symbols">
            <button className="sd-symbol-action" onClick={() => navigate("/wishlist")} title="Wishlist" aria-label="Wishlist">
              <i className="bi bi-heart" /><span>Wishlist</span>
            </button>
            <button className="sd-symbol-action" onClick={() => navigate("/admin")} title="Admin Dashboard" aria-label="Admin Dashboard">
              <i className="bi bi-person-gear" /><span>Admin</span>
            </button>
          </div>
        </div>
      </div></div></div>
      {menuOpen && user && <div className="user-menu"><div><strong>{user.username}</strong><small>{user.email}</small></div><Link to="/orders" onClick={() => setMenuOpen(false)}>My Orders</Link><Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link><button onClick={() => { logout(); setMenuOpen(false); }}>Logout</button></div>}
    </header>
  );
};
export default Header;
