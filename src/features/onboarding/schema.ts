import { z } from "zod";

/*
  Note: We use the schema sensitive data such as password in here using store. This is no secure and 
  should not be used as production. Ensure this is properly encrypted to avoid security 
  vulnerabilites by hashing against database 
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
