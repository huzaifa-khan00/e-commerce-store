import { useEffect, useState } from "react";
import { subscribeToOrders } from "../services/orderService";

// Live list of orders, newest first. Updates by itself when new orders arrive.
export default function useOrders() {
  const [state, setState] = useState({ orders: [], loading: true, error: "" });

  useEffect(() => {
    const unsubscribe = subscribeToOrders(
      (orders) => setState({ orders, loading: false, error: "" }),
      (err) => {
        console.error("Failed to load orders:", err);
        setState({ orders: [], loading: false, error: "Couldn't load orders." });
      }
    );
    return unsubscribe;
  }, []);

  return state;
}