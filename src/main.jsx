import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";

import { checkoutSchema } from "./schemas/checkoutSchema";
import { trackOrderSchema } from "./schemas/trackOrderSchema";

console.log(
  "good:",
  checkoutSchema.safeParse({
    fullName: "Ali Khan",
    phone: "+92 300 1234567",
    address: "House 12, Street 4, Gulshan",
    city: "Karachi",
  })
);
console.log(
  "bad:",
  checkoutSchema.safeParse({ fullName: "A", phone: "12345", address: "x", city: "Mars" })
);
console.log("track:", trackOrderSchema.safeParse({ orderNumber: "ord-4f9k2x" }));

// Mounts the React app into <div id="root"> from index.html
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);