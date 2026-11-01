import { z } from "zod";
import { CITIES } from "../data/cities";
import { isValidPhone, normalizePhone } from "../utils/phone";

export const checkoutSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(3, "Please enter your full name")
    .max(60, "Name is too long")
    .regex(/^[\p{L}\s.'-]+$/u, "Name can only contain letters"),

  // Accepts 0300-1234567, +92 300 1234567 etc., and stores 03001234567.
  phone: z
    .string()
    .trim()
    .min(1, "Phone number is required")
    .refine(isValidPhone, "Enter a valid 11-digit number, e.g. 03001234567")
    .transform(normalizePhone),

  address: z
    .string()
    .trim()
    .min(10, "Please enter your complete address")
    .max(200, "Address is too long"),

  city: z.enum(CITIES, {
    errorMap: () => ({ message: "Please select your city" }),
  }),

  notes: z.string().trim().max(300, "Notes are too long").optional(),
});