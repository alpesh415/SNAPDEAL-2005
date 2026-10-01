


import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { PLACEHOLDER_IMAGE } from "../services/api";
import "./ProductCard.css";

const ProductCard = ({ product }) => {
  const navigate = useNavigate();

  const {
    addToCart,
    toggleWishlist,
    isWishlisted,
  } = useAppContext();

  const wish = isWishlisted(product.id);

  return (
    <div
      className="product-card"
      onClick={() => navigate(`/product/${product.id}`)}
    >
     
      <div className="product-image-box">
        <img
          src={product.image}
          alt={product.title}
          className="product-image"
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = PLACEHOLDER_IMAGE;
          }}
        />

      
        <button
          className={`wishlist-btn ${wish ? "active" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            toggleWishlist(product);
          }}
          aria-label="Wishlist"
        >
          <i
            className={`bi ${
              wish ? "bi-heart-fill" : "bi-heart"
            }`}
          />
        </button>
      </div>

    
      <div className="product-info">
        <h3 className="product-title">{product.title}</h3>

 
        <div className="product-rating">
          <span className="rating">
            ★ {product.rating}
          </span>

          <span className="reviews">
            ({product.reviews})
          </span>
        </div>

        <div className="product-price">
          <span className="price">
            ₹{product.price}
          </span>

          {product.discount > 0 && (
            <>
              <span className="old-price">
                ₹{product.oldPrice}
              </span>

              <span className="discount">
                {product.discount}% OFF
              </span>
            </>
          )}
        </div>

       
        <button
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            addToCart(product);
          }}
        >
          🛒 Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;