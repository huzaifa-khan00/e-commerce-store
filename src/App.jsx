import { MotionConfig } from "framer-motion";
import Navbar from "./layout/Navbar";
import AppRoutes from "./routes/AppRoutes";

export default function App() {
  return (
    // reducedMotion="user" turns animations off for people who prefer less motion
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <AppRoutes />
      </main>
    </MotionConfig>
  );
}