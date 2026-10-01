import React from "react";
import { Link } from "react-router-dom";
import CategoryMenu from "../CategoryMenu/CategoryMenu";
import Banner from "../Banner/Banner";
import ProductCard from "../ProductCard/ProductCard";
import { useAppContext } from "../context/AppContext";

const Home = () => {
  const { products, productsLoading, backendOffline, refreshProducts } =
    useAppContext();

  return (
    <>
      <div className="container-fluid px-4 px-lg-5 py-4">
        <div className="row g-4">
          <div className="col-lg-3 col-md-4">
            <CategoryMenu />
          </div>

          <div className="col-lg-9 col-md-8">
            <Banner />
          </div>
        </div>

        <section className="mt-5">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h2 className="product-section-title">All Products</h2>

            <Link
              className="view-all-btn text-decoration-none"
              to="/category/all"
            >
              View All
            </Link>
          </div>

          {backendOffline && !productsLoading && (
            <div className="alert alert-warning d-flex justify-content-between align-items-center flex-wrap gap-2">
              <span>
                Backend/MongoDB se connect nahi hua, isliye demo products dikh rahe hain.
                Login, cart, orders aur payment ke liye backend chalana zaroori hai.
                <br />
                <small>{backendOffline}</small>
              </span>
              <button className="btn btn-sm btn-danger" onClick={refreshProducts}>
                Retry
              </button>
            </div>
          )}

          {productsLoading ? (
            <div className="text-center p-5">Loading products...</div>
          ) : products.length ? (
            <div className="row g-3">
              {products.map((p) => (
                <div
                  className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
                  key={p.id}
                >
                  <ProductCard product={p} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center p-5">
              No products found. Add some from the Admin Dashboard.
            </div>
          )}
        </section>
      </div>
    </>
  );
};

export default Home;
