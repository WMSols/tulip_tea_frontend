import { z } from "zod";

// ─── Login ────────────────────────────────────────────────────────
export const loginSchema = z.object({
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^03\d{9}$/, "Enter a valid phone number (e.g. 03XXXXXXXXX)"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// ─── Product ──────────────────────────────────────────────────────
export const productSchema = z.object({
  code: z
    .string()
    .min(1, "Product code is required")
    .max(20, "Product code must be 20 characters or less"),
  name: z
    .string()
    .min(1, "Product name is required")
    .max(100, "Product name must be 100 characters or less"),
  unit: z.string().min(1, "Unit is required"),
  price: z
    .string()
    .min(1, "Price is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Price must be a number greater than 0",
    }),
  is_active: z.boolean(),
});

export type ProductFormValues = z.infer<typeof productSchema>;

// ─── Zone ─────────────────────────────────────────────────────────
export const zoneSchema = z.object({
  name: z
    .string()
    .min(1, "Zone name is required")
    .max(50, "Zone name must be 50 characters or less"),
});

export type ZoneFormValues = z.infer<typeof zoneSchema>;

// ─── Route ────────────────────────────────────────────────────────
export const routeSchema = z.object({
  name: z
    .string()
    .min(1, "Route name is required")
    .max(100, "Route name must be 100 characters or less"),
  zone_id: z.string().min(1, "Zone is required"),
  order_booker_id: z.string().optional(),
});

export type RouteFormValues = z.infer<typeof routeSchema>;

// ─── Staff (Order Booker / Delivery Man) ──────────────────────────
export const staffSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .max(100, "Name must be 100 characters or less"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^03\d{9}$/, "Enter a valid phone number (e.g. 03XXXXXXXXX)"),
  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
  role: z.enum(["order_booker", "delivery_man"], {
    required_error: "Role is required",
  }),
  zone: z.string().min(1, "Zone is required"),
});

// For editing — password is optional
export const staffEditSchema = staffSchema.extend({
  password: z
    .string()
    .optional()
    .refine((val) => !val || val.length >= 6, {
      message: "Password must be at least 6 characters",
    }),
});

export type StaffFormValues = z.infer<typeof staffSchema>;

// ─── Warehouse ────────────────────────────────────────────────────
export const warehouseSchema = z.object({
  name: z
    .string()
    .min(1, "Warehouse name is required")
    .max(100, "Warehouse name must be 100 characters or less"),
  address: z
    .string()
    .min(1, "Address is required")
    .max(200, "Address must be 200 characters or less"),
  zone_id: z.string().min(1, "Zone is required"),
});

export type WarehouseFormValues = z.infer<typeof warehouseSchema>;

// ─── Collect Money ────────────────────────────────────────────────
export const collectMoneySchema = (maxBalance: number) =>
  z.object({
    amount: z
      .string()
      .min(1, "Amount is required")
      .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
        message: "Amount must be greater than 0",
      })
      .refine((val) => Number(val) <= maxBalance, {
        message: `Amount cannot exceed ${maxBalance.toLocaleString()}`,
      }),
    description: z.string().optional(),
  });

export type CollectMoneyFormValues = z.infer<
  ReturnType<typeof collectMoneySchema>
>;

// ─── Credit Remark ────────────────────────────────────────────────
export const creditRemarkSchema = z.object({
  remarks: z.string().optional(),
});

export type CreditRemarkFormValues = z.infer<typeof creditRemarkSchema>;

// ─── Validation helper ───────────────────────────────────────────
export type FormErrors<T> = Partial<Record<keyof T, string>>;

/**
 * Validate form data against a Zod schema.
 * Returns an errors object (empty = valid).
 */
export function validateForm<T extends Record<string, any>>(
  schema: z.ZodSchema<T>,
  data: Record<string, any>,
): FormErrors<T> {
  const result = schema.safeParse(data);
  if (result.success) return {};

  const errors: FormErrors<T> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as keyof T;
    if (!errors[key]) {
      errors[key] = issue.message;
    }
  }
  return errors;
}
