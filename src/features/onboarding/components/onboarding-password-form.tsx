"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { onboardingBaseSchema } from "../schema";
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
import { useOnboardingStore } from "@/app/onboarding/store";
import { useEffect } from "react";

const onboardingPasswordSchema = onboardingBaseSchema
  .pick({
    password: true,
    repeatPassword: true,
  })
  .refine((data) => data.password === data.repeatPassword, {
    message: "Passwords don't match",
    path: ["repeatPassword"],
  });

type OnboardingPasswordSchema = z.infer<typeof onboardingPasswordSchema>;

export const OnboardingPasswordForm = () => {
  const router = useRouter();
  const setData = useOnboardingStore((state) => state.setData);

  const form = useForm<OnboardingPasswordSchema>({
    resolver: zodResolver(onboardingPasswordSchema),
    defaultValues: {
      password: "",
      repeatPassword: "",
    },
  });

  const onPrevious = () => {
    const formValues = form.getValues();
    setData(formValues);
    router.push("/onboarding/name");
  };

  const onSubmit = (data: OnboardingPasswordSchema) => {
    setData(data);
    router.push("/onboarding/username");
  };

  // Check for redirect when store hydrates (if name data is missing)
  useEffect(() => {
    const checkAndRedirect = () => {
      const state = useOnboardingStore.getState();
      if (!state.firstName || !state.lastName) {
        router.push("/onboarding/name");
      }
    };

    // Check if already hydrated
    if (useOnboardingStore.persist?.hasHydrated()) {
      checkAndRedirect();
    }

    // Listen for future hydration
    const unsubscribe = useOnboardingStore.persist.onFinishHydration(() => {
      checkAndRedirect();
    });

    return () => unsubscribe();
  }, [router]);

  // Pre-fill form when store hydrates from localStorage
  useEffect(() => {
    const handleHydration = () => {
      const state = useOnboardingStore.getState();
      // Only pre-fill if we have data
      if (state.password || state.repeatPassword) {
        form.reset({
          password: state.password || "",
          repeatPassword: state.repeatPassword || "",
        });
      }
    };

    // Check if already hydrated
    if (useOnboardingStore.persist?.hasHydrated()) {
      handleHydration();
    }

    // Listen for future hydration
    const unsubscribe = useOnboardingStore.persist.onFinishHydration(() => {
      handleHydration();
    });

    return () => unsubscribe();
  }, [form]);

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
        <Field orientation="horizontal" className="gap-4">
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
          <Button type="submit" form="form-rhf-onboarding">
            Next
          </Button>
        </Field>
      </form>
    </div>
  );
};
