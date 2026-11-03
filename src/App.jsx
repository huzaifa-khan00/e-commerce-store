import { MotionConfig } from "framer-motion";
import { useLocation } from "react-router-dom";
import Navbar from "./layout/Navbar";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { ProductProvider } from "./context/ProductContext";

export default function App() {
  const { pathname } = useLocation();
  const isAdminPage = pathname.startsWith("/admin");

  return (
    // reducedMotion="user" turns animations off for people who prefer less motion
    <MotionConfig reducedMotion="user">
      <AuthProvider>
        <ProductProvider>
          {!isAdminPage && <Navbar />}
          <main>
            <AppRoutes />
          </main>
        </ProductProvider>
      </AuthProvider>
    </MotionConfig>
  );
}