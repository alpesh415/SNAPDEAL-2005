
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import ProductCard from "../ProductCard/ProductCard";

const Wishlist = () => {
  const navigate = useNavigate();
  const { wishlist } = useAppContext();

  return (
    <div className="container py-5">
   
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Wishlist</h2>

        <button
          className="btn btn-outline-secondary"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>

      {wishlist.length === 0 ? (
        <div className="text-center bg-white p-5">
          <div style={{ fontSize: 50 }}>♡</div>

          <h3>Your wishlist is empty</h3>

          <p>Save products you love and find them here.</p>

          <button
            className="btn btn-danger"
            onClick={() => navigate("/")}
          >
            Explore Products
          </button>
        </div>
      ) : (
        <div className="row g-3">
          {wishlist.map((p) => (
            <div
              className="col-xl-3 col-lg-4 col-md-6"
              key={p.id}
            >
              <ProductCard product={p} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;