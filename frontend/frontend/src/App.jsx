



import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import Header from "./components/Header/Header";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";

import Home from "./components/pages/Home";
import ProductDetails from "./components/pages/ProductDetails";
import Cart from "./components/pages/Cart";
import Checkout from "./components/pages/Checkout";
import Payment from "./components/pages/Payment";
import Orders from "./components/pages/Orders";
import Login from "./components/pages/Login";
import Register from "./components/pages/Register";
import Wishlist from "./components/pages/Wishlist";

import ProductCard from "./components/ProductCard/ProductCard";

import { AppProvider, useAppContext } from "./components/context/AppContext";
import ForgotPassword from "./components/pages/ForgotPassword";
import AdminDashboard from "./components/pages/AdminDashboard";

// Category Names
const slugName = {
  "mens-fashion": "Men's Fashion",
  "womens-fashion": "Women's Fashion",
  electronics: "Electronics",
  "mobiles-tablets": "Mobiles & Tablets",
  beauty: "Beauty",
  "home-kitchen": "Home & Kitchen",
  "toys-kids": "Toys, Kids & Babies",
  sports: "Sports & Fitness",
  automotives: "Automotives",
  books: "Books & Stationery",
  all: "All Products",
};

// Category Page
const CategoryPage = () => {
  const { pathname } = useLocation();
  const { products, productsLoading } = useAppContext();

  const slug = pathname.split("/").pop();

  const list =
    slug === "all"
      ? products
      : products.filter((p) => p.category === slugName[slug]);

  if (productsLoading) {
    return <div className="text-center p-5">Loading products...</div>;
  }

  return (
    <div className="container-fluid px-4 px-lg-5 py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <small className="text-muted">
            Home / Category
          </small>

          <h2>{slugName[slug] || "Products"}</h2>
        </div>

        <span>{list.length} products</span>
      </div>

      {list.length ? (
        <div className="row g-3">
          {list.map((p) => (
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
          No products found.
        </div>
      )}
    </div>
  );
};

// Search Page
const SearchPage = () => {
  const { search } = useLocation();
  const { products } = useAppContext();

  const q =
    new URLSearchParams(search).get("q") || "";

  const list = products.filter((p) =>
    `${p.title} ${p.brand} ${p.category}`
      .toLowerCase()
      .includes(q.toLowerCase())
  );

  return (
    <div className="container-fluid px-4 px-lg-5 py-5">
      <h2>Search results for “{q}”</h2>

      <div className="row g-3 mt-2">
        {list.map((p) => (
          <div
            className="col-xl-2 col-lg-3 col-md-4 col-sm-6"
            key={p.id}
          >
            <ProductCard product={p} />
          </div>
        ))}
      </div>

      {!list.length && (
        <p className="py-5">
          No matching products found.
        </p>
      )}
    </div>
  );
};

// Common Layout
const Layout = ({ children }) => (
  <>
    <Header />
    <Navbar />

    {children}

    <Footer />
  </>
);

// Main App
const App = () => (
  <AppProvider>
    <BrowserRouter>
      <Routes>
        {/* Home */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />

        {/* Product Details */}
        <Route
          path="/product/:id"
          element={
            <Layout>
              <ProductDetails />
            </Layout>
          }
        />

        {/* Categories */}
        <Route
          path="/category/:slug"
          element={
            <Layout>
              <CategoryPage />
            </Layout>
          }
        />
        <Route
  path="/forgot-password"
  element={
    <Layout>
      <ForgotPassword />
    </Layout>
  }
/>

        {/* Search */}
        <Route
          path="/search"
          element={
            <Layout>
              <SearchPage />
            </Layout>
          }
        />

        {/* Cart */}
        <Route
          path="/cart"
          element={
            <Layout>
              <Cart />
            </Layout>
          }
        />

        {/* Checkout */}
        <Route
          path="/checkout"
          element={
            <Layout>
              <Checkout />
            </Layout>
          }
        />

        {/* Payment */}
        <Route
          path="/payment"
          element={
            <Layout>
              <Payment />
            </Layout>
          }
        />

        {/* Orders */}
        <Route
          path="/orders"
          element={
            <Layout>
              <Orders />
            </Layout>
          }
        />

        {/* Wishlist */}
        <Route
          path="/wishlist"
          element={
            <Layout>
              <Wishlist />
            </Layout>
          }
        />

        {/* Login */}
        <Route
          path="/login"
          element={
            <Layout>
              <Login />
            </Layout>
          }
        />

        {/* Register */}
        <Route
          path="/register"
          element={
            <Layout>
              <Register />
            </Layout>
          }
        />

        {/* Admin Dashboard */}
        <Route path="/admin" element={<Layout><AdminDashboard /></Layout>} />

        {/* Invalid Route */}
        <Route
          path="*"
          element={<Navigate to="/" replace />}
        />
      </Routes>
    </BrowserRouter>
  </AppProvider>
);

export default App;