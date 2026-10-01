import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

const categories = [
  ["Men's Fashion", "mens-fashion", "bi-person"],
  ["Women's Fashion", "womens-fashion", "bi-person-dress"],
  ["Electronics", "electronics", "bi-laptop"],
  ["Mobiles & Tablets", "mobiles-tablets", "bi-phone"],
  ["Beauty", "beauty", "bi-stars"],
  ["Home & Kitchen", "home-kitchen", "bi-house"],
  ["Toys, Kids & Babies", "toys-kids", "bi-balloon"],
  ["Sports", "sports", "bi-trophy"],
  ["Automotives", "automotives", "bi-car-front"],
];

const Navbar = () => (
  <nav className="sd-navbar">
    <div className="container-fluid px-4 px-lg-5">
      <div className="row align-items-center">
        <div className="col-lg-3 col-md-4 col-12">
          <Link className="sd-all-category text-decoration-none" to="/">
            <i className="bi bi-list" />
            <span>ALL CATEGORIES</span>
            <i className="bi bi-chevron-down ms-auto" />
          </Link>
        </div>
        <div className="col-lg-9 col-md-8 d-none d-md-block">
          <div className="sd-category-scroll">
            {categories.map(([name, slug, icon]) => (
              <Link
                className="sd-nav-category text-decoration-none"
                key={slug}
                to={`/category/${slug}`}
              >
                <i className={`bi ${icon}`} />
                <span>{name}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  </nav>
);
export default Navbar;
