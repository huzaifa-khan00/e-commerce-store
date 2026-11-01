import { MotionConfig } from "framer-motion";
import Navbar from "./layout/Navbar";
import HomePage from "./pages/HomePage";

export default function App() {
  return (
    // reducedMotion="user" turns animations off for people who prefer less motion
    <MotionConfig reducedMotion="user">
      <Navbar />
      <main>
        <HomePage />
      </main>
    </MotionConfig>
  );
}