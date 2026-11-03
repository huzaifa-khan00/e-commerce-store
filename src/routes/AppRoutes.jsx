import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "../pages/HomePage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSuccessPage from "../pages/OrderSuccessPage";
import TrackOrderPage from "../pages/TrackOrderPage";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/checkout" element={<CheckoutPage />} />
      <Route path="/order-success" element={<OrderSuccessPage />} />
      <Route path="/track-order" element={<TrackOrderPage />} />
      {/* Unknown URLs go home for now; a proper 404 page comes later */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}