import { useState, useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = () => {
    setLoading(true);
    fetch("https://rose-candle-co.onrender.com/api/products")
      .then(res => res.json())
      .then(data => {
        const cleanData = data.map(({ createdAt, updatedAt, __v, ...rest }) => rest);
        setProducts(cleanData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error cargando productos:", error);
        setLoading(false);
      });
  };

  useFocusEffect(
    useCallback(() => {
      fetchProducts();
    }, [])
  );

  return { products, loading };
}
