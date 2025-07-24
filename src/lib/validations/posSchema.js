import { z } from "zod";

export const posSchema = z.object({
  userId: z.string().optional(),
  name: z.string().min(1, "User Name is required"),
  phoneNo: z.string().min(1, "Phone Number is required"),
  gst: z.string().optional(),
  method: z.string().min(1, "Please select payment method"),
  subtotal: z.number().min(0),
  discount: z.preprocess((val) => {
    if (val === "") return undefined;
    return typeof val === "string" ? Number(val) : val;
  }, z.number().optional()),
  orderAmount: z.number().min(0),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product ID is required"),
        variantName: z.string().optional(),
        quantity: z.number().min(1, "Quantity must be at least 1"),
        price: z.number().min(0),
      })
    )
    .min(1, "At least one item is required"),
});
