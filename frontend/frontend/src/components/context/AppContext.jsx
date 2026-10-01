import React, { createContext, useContext, useEffect, useMemo, useState, useCallback, useRef } from "react";
import api, { normalizeProduct } from "../services/api";
import demoProducts from "../../data/demoProducts.json";

const AppContext = createContext(null);

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback;
  } catch {
    return fallback;
  }
};

export const AppProvider = ({ children }) => {
  const [cart, setCart] = useState(() => read("cart", []));
  const [wishlist, setWishlist] = useState(() => read("wishlist", []));
  const [user, setUserState] = useState(() => {
    const saved = read("currentUser", null);
    const id = String(saved?.id || saved?._id || "");
    // Only MongoDB users (24-char ids) are valid. Old demo users saved in the
    // browser (numeric ids) are removed so the person can register/login again.
    if (saved && !/^[a-f\d]{24}$/i.test(id)) {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("token");
      return null;
    }
    return saved;
  });

  const [products, setProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  // Set when the backend cannot be reached; demo products are shown meanwhile.
  const [backendOffline, setBackendOffline] = useState("");

  const syncedGuestCartRef = useRef(false);

  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);
  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => {
    if (user) localStorage.setItem("currentUser", JSON.stringify(user));
    else localStorage.removeItem("currentUser");
  }, [user]);


  const refreshProducts = useCallback(async () => {
    try {
      setProductsLoading(true);
      setBackendOffline("");
      const data = await api.products.getAll();
      setProducts((data.products || []).map(normalizeProduct));
    } catch (err) {
      console.error("Failed to load products:", err.message);
      setBackendOffline(err.message || "Backend se connect nahi ho paya.");
      setProducts(
        demoProducts.map((p, i) => normalizeProduct({ ...p, _id: `demo-${i + 1}`, category: p.categoryName }))
      );
    } finally {
      setProductsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshProducts();
  }, [refreshProducts]);

  
  const cartItemFromServer = (item) => {
    const p = normalizeProduct(item.product);
    return { ...p, quantity: item.quantity };
  };

  const refreshCartFromServer = useCallback(async (userId) => {
    try {
      const data = await api.cart.get(userId);
      const items = (data.cart?.products || [])
        .filter((item) => item.product)
        .map(cartItemFromServer);
      setCart(items);
    } catch {
      
      setCart([]);
    }
  }, []);

  const refreshWishlistFromServer = useCallback(async (userId) => {
    try {
      const data = await api.wishlist.get(userId);
      const items = (data.wishlist?.products || []).filter(Boolean).map(normalizeProduct);
      setWishlist(items);
    } catch {
      setWishlist([]);
    }
  }, []);

  
  useEffect(() => {
    const userId = user?.id || user?._id;
    if (!userId) {
      syncedGuestCartRef.current = false;
      return;
    }

    (async () => {
      if (!syncedGuestCartRef.current && cart.length) {
        for (const item of cart) {
          const productId = item._id || item.id;
          try {
            await api.cart.add({ userId, productId, quantity: item.quantity || 1 });
          } catch {
            
          }
        }
      }
      syncedGuestCartRef.current = true;

      await refreshCartFromServer(userId);
      await refreshWishlistFromServer(userId);
    })();
    
  }, [user?.id, user?._id]);

  const setUser = (u) => setUserState(u);

  const addToCart = async (product, quantity = 1) => {
    const key = product._id || product.id;
    const userId = user?.id || user?._id;

    
    setCart((items) => {
      const found = items.find((i) => (i._id || i.id) === key);
      if (found) {
        return items.map((i) =>
          (i._id || i.id) === key ? { ...i, quantity: i.quantity + quantity } : i
        );
      }
      return [...items, { ...product, quantity }];
    });

    if (userId) {
      try {
        await api.cart.add({ userId, productId: key, quantity });
        await refreshCartFromServer(userId);
      } catch (err) {
        console.error("Add to cart failed:", err.message);
      }
    }
  };

  const removeFromCart = async (id) => {
    setCart((items) => items.filter((i) => (i._id || i.id) !== id));

    const userId = user?.id || user?._id;
    if (userId) {
      try {
        await api.cart.remove({ userId, productId: id });
      } catch (err) {
        console.error("Remove from cart failed:", err.message);
      }
    }
  };

  const changeQuantity = async (id, nextQty) => {
    if (nextQty < 1) return removeFromCart(id);

    setCart((items) => items.map((i) => ((i._id || i.id) === id ? { ...i, quantity: nextQty } : i)));

    const userId = user?.id || user?._id;
    if (userId) {
      try {
        await api.cart.update({ userId, productId: id, quantity: nextQty });
      } catch (err) {
        console.error("Update cart failed:", err.message);
      }
    }
  };

  const increaseQuantity = (id) => {
    const current = cart.find((i) => (i._id || i.id) === id);
    changeQuantity(id, (current?.quantity || 0) + 1);
  };

  const decreaseQuantity = (id) => {
    const current = cart.find((i) => (i._id || i.id) === id);
    changeQuantity(id, (current?.quantity || 0) - 1);
  };

  const clearCart = async () => {
    setCart([]);
    const userId = user?.id || user?._id;
    if (userId) {
      try {
        await api.cart.clear({ userId });
      } catch (err) {
        console.error("Clear cart failed:", err.message);
      }
    }
  };

  const toggleWishlist = async (product) => {
    const productId = product._id || product.id;
    const userId = user?.id || user?._id;
    const exists = wishlist.some((i) => (i._id || i.id) === productId);

    if (userId && productId) {
      try {
        if (exists) {
          await api.wishlist.remove({ userId, productId });
        } else {
          await api.wishlist.add({ userId, productId });
        }
        await refreshWishlistFromServer(userId);
        return;
      } catch (err) {
        console.error("Wishlist update failed:", err.message);
      }
    }

    setWishlist((items) =>
      exists ? items.filter((i) => (i._id || i.id) !== productId) : [...items, product]
    );
  };

  const isWishlisted = (id) => wishlist.some((i) => (i._id || i.id) === id);

  const cartCount = useMemo(() => cart.reduce((s, i) => s + i.quantity, 0), [cart]);
  const cartTotal = useMemo(() => cart.reduce((s, i) => s + Number(i.price) * i.quantity, 0), [cart]);

  const logout = () => {
    localStorage.removeItem("token");
    setUserState(null);
    setCart([]);
    setWishlist([]);
  };

  return (
    <AppContext.Provider
      value={{
        cart,
        wishlist,
        user,
        setUser,
        logout,
        addToCart,
        removeFromCart,
        increaseQuantity,
        decreaseQuantity,
        clearCart,
        toggleWishlist,
        isWishlisted,
        cartCount,
        cartTotal,
        products,
        productsLoading,
        backendOffline,
        refreshProducts,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
