"use client";
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "../lib/api.js";
import { useAuth } from "./AuthContext.jsx";

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { user } = useAuth();
  const [productIds, setProductIds] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  };

  const refresh = useCallback(async () => {
    if (!user) {
      setProductIds([]);
      setProducts([]);
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.get("/wishlist");
      const ids = (data.products || []).map((p) => p._id);
      setProductIds(ids);
      setProducts(data.products || []);
    } catch {
      /* backend unreachable or wishlist empty */
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const isWishlisted = (productId) => productIds.includes(productId);

  const toggle = async (product) => {
    if (!user) {
      showToast("Please log in to save items to your wishlist");
      return { requiresLogin: true };
    }
    const already = isWishlisted(product._id);
    try {
      if (already) {
        await api.delete(`/wishlist/${product._id}`);
        setProductIds((prev) => prev.filter((id) => id !== product._id));
        setProducts((prev) => prev.filter((p) => p._id !== product._id));
        showToast("Product removed from your wishlist.");
      } else {
        await api.post("/wishlist", { productId: product._id });
        setProductIds((prev) => [...prev, product._id]);
        setProducts((prev) => [...prev, product]);
        showToast("Product added to your wishlist.");
      }
    } catch (err) {
      showToast(err.response?.data?.message || "Something went wrong updating your wishlist");
    }
  };

  return (
    <WishlistContext.Provider value={{ productIds, products, loading, isWishlisted, toggle, refresh, toast }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
