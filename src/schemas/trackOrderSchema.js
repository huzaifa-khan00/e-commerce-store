import { z } from "zod";

// Order numbers look like ORD-4F9K2X. Input is uppercased before checking,
// so "ord-4f9k2x" works too.
export const ORDER_NUMBER_REGEX = /^ORD-[A-Z0-9]{6}$/;

export const trackOrderSchema = z.object({
  orderNumber: z
    .string()
    .trim()
    .min(1, "Enter your order number")
    .transform((v) => v.toUpperCase())
    .refine(
      (v) => ORDER_NUMBER_REGEX.test(v),
      "Order numbers look like ORD-4F9K2X"
    ),
});