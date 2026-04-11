"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { onboardingSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import InputPassword from "@/components/ui/custom/input-password";

const onboardingPasswordSchema = onboardingSchema.pick({
  password: true,
  repeatPassword: true,
});

type OnboardingPasswordSchema = z.infer<typeof onboardingPasswordSchema>;

export const OnboardingPasswordForm = () => {
  const router = useRouter();

  const form = useForm<OnboardingPasswordSchema>({
    resolver: zodResolver(onboardingPasswordSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  const onSubmit = (data: OnboardingPasswordSchema) => {
    router.push("/onboarding/username");
    console.log(data);
  };

  return (
    <div>
      <span className="text-lg font-semibold">Password Details</span>
      <form
        id="form-rhf-onboarding"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <FieldGroup>
          <Controller
            name="password"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-password">Password</FieldLabel>
                <InputPassword
                  {...field}
                  id="form-rhf-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="repeatPassword"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-confirm-password">
                  Confirm Password
                </FieldLabel>
                <InputPassword
                  {...field}
                  id="form-rhf-confirm-password"
                  aria-invalid={fieldState.invalid}
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <Field orientation="horizontal">
          <Button type="submit" form="form-rhf-onboarding">
            Next
          </Button>
        </Field>
      </form>
    </div>
  );
};
