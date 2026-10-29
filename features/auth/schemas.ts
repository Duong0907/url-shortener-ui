import { z } from "zod";

const emailSchema = z.string().trim().pipe(z.email("Enter a valid email"));

export type AuthValues = { email: string; password: string; confirm: string };

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Enter your password"),
  confirm: z.string(),
});

export const registerSchema = z
  .object({
    email: emailSchema,
    password: z
      .string()
      .min(8, "Password needs at least 8 characters")
      .max(72, "Password can have at most 72 characters"),
    confirm: z.string(),
  })
  .refine((v) => v.password === v.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

export const resendSchema = z.object({ email: emailSchema });
