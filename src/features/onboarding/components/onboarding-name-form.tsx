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
import { Input } from "@/components/ui/input";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useOnboardingStore } from "@/app/onboarding/store";
import { useEffect } from "react";

const onboardingNameSchema = onboardingBaseSchema.pick({
  firstName: true,
  lastName: true,
});

type OnboardingNameSchema = z.infer<typeof onboardingNameSchema>;

export const OnboardingNameForm = () => {
  const router = useRouter();
  const setData = useOnboardingStore((state) => state.setData);
  const form = useForm<OnboardingNameSchema>({
    resolver: zodResolver(onboardingNameSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
    },
  });

  const onSubmit = (data: OnboardingNameSchema) => {
    setData(data);
    router.push("/onboarding/password");
  };

  useEffect(() => {
    const handleHydration = () => {
      const state = useOnboardingStore.getState();
      // Only pre-fill if we have data
      if (state.firstName || state.lastName) {
        form.reset({
          firstName: state.firstName,
          lastName: state.lastName,
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
      <span className="text-lg font-semibold">Personal Information</span>
      <form
        id="form-rhf-onboarding"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <FieldGroup className="max-w-md">
          <Controller
            name="firstName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-first-name">
                  First Name
                </FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-first-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="John"
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
          <Controller
            name="lastName"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-last-name">Last Name</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-last-name"
                  aria-invalid={fieldState.invalid}
                  placeholder="Doe"
                  autoComplete="off"
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
