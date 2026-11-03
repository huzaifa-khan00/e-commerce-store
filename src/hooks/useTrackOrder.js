import { useCallback, useState } from "react";
import { getTracking } from "../services/trackingService";

// error is "" | "not_found" | "failed"
export default function useTrackOrder() {
  const [state, setState] = useState({
    tracking: null,
    loading: false,
    error: "",
  });

  const track = useCallback(async (orderNumber) => {
    setState({ tracking: null, loading: true, error: "" });
    try {
      const tracking = await getTracking(orderNumber);
      setState({
        tracking,
        loading: false,
        error: tracking ? "" : "not_found",
      });
    } catch (err) {
      console.error("Tracking lookup failed:", err);
      setState({ tracking: null, loading: false, error: "failed" });
    }
  }, []);

  return { ...state, track };
}