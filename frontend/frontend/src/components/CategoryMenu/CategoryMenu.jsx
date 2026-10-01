






import React from "react";
import { Link } from "react-router-dom";
import "./CategoryMenu.css";

const categories = [
  ["Men's Fashion", "mens-fashion", "bi-person"],
  ["Women's Fashion", "womens-fashion", "bi-person-dress"],
  ["Toys, Kids & Babies", "toys-kids", "bi-balloon"],
  ["Beauty & Personal Care", "beauty", "bi-stars"],
  ["Home & Kitchen", "home-kitchen", "bi-house"],
  ["Electronics", "electronics", "bi-laptop"],
  ["Mobiles & Tablets", "mobiles-tablets", "bi-phone"],
  ["Sports & Fitness", "sports", "bi-trophy"],
  ["Automotives", "automotives", "bi-car-front"],
  ["Books & Stationery", "books", "bi-book"],
];

const CategoryMenu = () => (
  <div className="category-menu">
    <div className="category-title">
      <i className="bi bi-list" />
      <span>SHOP BY CATEGORY</span>
    </div>

    <div className="category-list">
      {categories.map(([name, slug, icon]) => (
        <Link
          className="category-item text-decoration-none"
          key={slug}
          to={`/category/${slug}`}
        >
          <div className="category-left">
            <i className={`bi ${icon}`} />
            <span>{name}</span>
          </div>

          <i className="bi bi-chevron-right category-arrow" />
        </Link>
      ))}
    </div>

    <Link className="view-all-category text-decoration-none" to="/">
      View All Categories
      <i className="bi bi-chevron-right" />
    </Link>
  </div>
);

export default CategoryMenu;