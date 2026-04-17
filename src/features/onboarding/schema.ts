import { z } from "zod";

/*
  Security: Never persist `password`/`repeatPassword` in client-side storage (including persisted Zustand state).
  Keep password fields in ephemeral in-memory form state only, submit over HTTPS, and hash on the server
  using a password hashing algorithm (Argon2id/bcrypt/scrypt) with per-password salt.

  In this example we store passwords for debugging this example.
*/

// Base schema without password matching validation
export const onboardingBaseSchema = z.object({
  username: z.string().min(3).max(20),
  firstName: z.string().min(2).max(20),
  lastName: z.string().min(2).max(20),
  password: z.string().min(8).max(20),
  repeatPassword: z.string().min(8).max(20),
  terms: z.boolean().refine((data)=>data, {
    message: "You must accept the terms and conditions"
  })
});

// Full schema with password matching validation
export const onboardingSchema = onboardingBaseSchema.refine(
  (data) => data.password === data.repeatPassword,
  {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  }
);

export type OnboardingSchema = z.infer<typeof onboardingSchema>;
