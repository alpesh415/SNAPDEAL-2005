


import React, { useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import { PLACEHOLDER_IMAGE } from "../services/api";
import "./ProductDetails.css";

const ProductDetails = () => {
  const { id } = useParams();

  const { addToCart, toggleWishlist, isWishlisted, products, productsLoading } =
    useAppContext();

  const product = useMemo(
    () => products.find((p) => String(p.id) === String(id)),
    [id, products]
  );

  const navigate = useNavigate();

  const [qty, setQty] = useState(1);

  if (productsLoading) {
    return <div className="text-center p-5">Loading product...</div>;
  }

  if (!product) {
    return (
      <div className="product-not-found">
        <h2>Product not found</h2>

        <button onClick={() => navigate("/")}>
          Back to Home
        </button>
      </div>
    );
  }

  const buy = () => {
    addToCart(product, qty);
    navigate("/checkout");
  };

  return (
    <div className="product-details-page">
      <div className="product-breadcrumb">
        <Link to="/">Home</Link> / Products / {product.title}
      </div>

      <div className="product-details-container">
        <div className="product-details-image-section">
          <div className="product-details-image-box">
            <img
              src={product.image}
              alt={product.title}
              onError={(e) => {
                e.currentTarget.onerror = null;
                e.currentTarget.src = PLACEHOLDER_IMAGE;
              }}
            />
          </div>

          <div className="product-action-buttons">
            <button
              className="details-cart-btn"
              onClick={() => addToCart(product, qty)}
            >
              🛒 Add to Cart
            </button>

            <button
              className="details-buy-btn"
              onClick={buy}
            >
              ⚡ Buy Now
            </button>
          </div>
        </div>

        <div className="product-details-info">
          <div className="d-flex justify-content-between gap-3">
            <h1>{product.title}</h1>

            <button
              className="btn btn-light"
              onClick={() => toggleWishlist(product)}
            >
              <i
                className={`bi ${
                  isWishlisted(product.id)
                    ? "bi-heart-fill text-danger"
                    : "bi-heart"
                }`}
              />{" "}
              Wishlist
            </button>
          </div>

          <div className="details-rating">
            <span className="details-rating-box">
              ★ {product.rating}
            </span>

            <span>
              {product.reviews} Ratings & Reviews
            </span>
          </div>

          <hr />

          <div className="details-price-section">
            <span className="details-price">
              ₹{product.price}
            </span>

            {product.discount > 0 && (
              <>
                <span className="details-old-price">
                  ₹{product.oldPrice}
                </span>

                <span className="details-discount">
                  {product.discount}% OFF
                </span>
              </>
            )}
          </div>

          <p className="tax-info">
            Inclusive of all taxes
          </p>

          <div className="quantity-box">
            <strong>Quantity:</strong>

            <button
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              −
            </button>

            <span>{qty}</span>

            <button onClick={() => setQty(qty + 1)}>
              +
            </button>
          </div>

          <div className="delivery-box">
            <strong>🚚 Free delivery</strong>
            <span>
              7 days easy returns • Secure payment
            </span>
          </div>

          <h4>Product Details</h4>

          <p>{product.description}</p>

          <ul>
            <li>Brand: {product.brand}</li>
            <li>Category: {product.category}</li>
            <li>In stock and ready to ship</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;