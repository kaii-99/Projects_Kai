import { z } from "zod";

export const AuthCredentialsValidator = z
  .object({
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" }),
    password2: z.string(),
  })
  .refine((data) => data.password === data.password2, {
    message: "Passwords must match",
    path: ["password2"],  
  });

export type TAuthCredentialsValidator = z.infer<
  typeof AuthCredentialsValidator
>;
