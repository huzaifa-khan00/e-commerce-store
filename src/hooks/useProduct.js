import { useContext } from "react";
import { ProductContext } from "../context/ProductContext";

// Returns { product, loading, error, reload }.
export default function useProduct() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used inside <ProductProvider>");
  return ctx;
}