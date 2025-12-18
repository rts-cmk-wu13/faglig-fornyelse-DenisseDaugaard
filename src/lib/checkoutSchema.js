// src/lib/checkoutSchema.js
import { z } from "zod";

export const checkoutSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  address: z.string().min(5, "Address is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  zipcode: z.string().min(2, "Zipcode is required"),
  email: z.string().email("Invalid email"),
  shipping: z.string().min(1, "Shipping method is required"),
  payment: z.string().min(1, "Payment method is required"),
  cardNumber: z.string().min(12, "Card number is required"),
  cardName: z.string().min(2, "Cardholder name is required"),
  month: z.string().min(1, "Month required"),
  year: z.string().min(2, "Year required"),
  cvv: z.string().min(3, "CVC required"),

});