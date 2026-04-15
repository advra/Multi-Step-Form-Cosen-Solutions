"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { onboardingBaseSchema } from "../schema";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Checkbox } from "@/components/ui/checkbox";
import { useOnboardingStore } from "@/app/onboarding/store";
import { useEffect } from "react";

const onboardingUsernameSchema = onboardingBaseSchema.pick({
  username: true,
  terms: true,
});

type OnboardingUsernameNameSchema = z.infer<typeof onboardingUsernameSchema>;

export const OnboardingUsernameForm = () => {
  const router = useRouter();
  const setData = useOnboardingStore((state) => state.setData);

  const form = useForm<OnboardingUsernameNameSchema>({
    resolver: zodResolver(onboardingUsernameSchema),
    defaultValues: {
      username: "",
      terms: false,
    },
  });

  // navigat to a page skipping current validation
  const onPrevious = () => {
    const formValues = form.getValues();
    setData(formValues);
    router.push("/onboarding/password");
  };

  const onSubmit = (data: OnboardingUsernameNameSchema) => {
    setData(data);
    router.push("/");
  };

  // Check for redirect when store hydrates (if name or password data is missing)
  useEffect(() => {
    const checkAndRedirect = () => {
      const state = useOnboardingStore.getState();
      if (!state.firstName || !state.lastName) {
        router.push("/onboarding/name");
      } else if (!state.password || !state.repeatPassword) {
        router.push("/onboarding/password");
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
      if (state.username || state.terms !== undefined) {
        form.reset({
          username: state.username || "",
          terms: state.terms || false,
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
    <>
      <span className="text-lg font-semibold">Account Information</span>
      <form
        id="form-rhf-onboarding"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <FieldGroup>
          <Controller
            name="username"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor="form-rhf-username">Username</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-username"
                  aria-invalid={fieldState.invalid}
                  autoComplete="off"
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        </FieldGroup>
        <FieldGroup>
          <Controller
            name="terms"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field orientation="horizontal">
                <Checkbox
                  id={field.name}
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  name={field.name}
                  onBlur={field.onBlur}
                  ref={field.ref}
                />
                <FieldContent>
                  <FieldLabel htmlFor={field.name}>
                    I accept terms and conditions
                  </FieldLabel>
                  <FieldDescription>
                    By clicking this checkbox, you agree to the Terms and
                    Conditions for registering with the use of email
                    notifications through for our services.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>
        <Field orientation="horizontal" className="gap-4">
          <Button
            type="button"
            variant="outline"
            className="ml-auto"
            onClick={onPrevious}
          >
            Back
          </Button>
          <Button type="submit" form="form-rhf-onboarding">
            Submit
          </Button>
        </Field>
      </form>
    </>
  );
};
