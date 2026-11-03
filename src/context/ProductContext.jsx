// src/context/ProductContext.jsx
import { createContext, useCallback, useEffect, useState } from "react";
import { getProduct } from "../services/productService";

export const ProductContext = createContext(null);

// Loads the product once and shares it with every component.
export function ProductProvider({ children }) {
  const [state, setState] = useState({
    product: null,
    loading: true,
    error: false,
  });

  const load = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: false }));
    try {
      const product = await getProduct();
      setState({ product, loading: false, error: product === null });
    } catch (err) {
      console.error("Failed to load product:", err);
      setState({ product: null, loading: false, error: true });
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <ProductContext.Provider value={{ ...state, reload: load }}>
      {children}
    </ProductContext.Provider>
  );
}