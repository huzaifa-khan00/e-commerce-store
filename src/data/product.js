// Single source of truth for the product. Replace with the client's real
// details. Later this moves to Firestore; the shape is kept Firestore-friendly.
export const PRODUCT = {
  id: "flagship-001",
  name: "Flagship Product", // placeholder
  tagline: "Premium build. Three signature colors.",
  price: 4999, // PKR
  compareAtPrice: 6499, // crossed-out "old" price
  maxPerOrder: 5,
  variants: [
    {
      id: "midnight-black",
      name: "Midnight Black",
      hex: "#1F2937",
      image: "/images/product-black.png",
      stock: 12,
    },
    {
      id: "cyber-silver",
      name: "Cyber Silver",
      hex: "#C0C7D1",
      image: "/images/product-silver.png",
      stock: 4,
    },
    {
      id: "electric-crimson",
      name: "Electric Crimson",
      hex: "#DC2626",
      image: "/images/product-crimson.png",
      stock: 8,
    },
  ],
};