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
import { useEffect, useState } from "react";

const onboardingUsernameSchema = onboardingBaseSchema.pick({
  username: true,
  terms: true,
});

type OnboardingUsernameNameSchema = z.infer<typeof onboardingUsernameSchema>;

export const OnboardingUsernameForm = () => {
  const router = useRouter();
  const [hasHydrated, setHasHydrated] = useState(false);
  const firstName = useOnboardingStore((state) => state.firstName);
  const lastName = useOnboardingStore((state) => state.lastName);
  const password = useOnboardingStore((state) => state.password);
  const repeatPassword = useOnboardingStore((state) => state.repeatPassword);

  const form = useForm<OnboardingUsernameNameSchema>({
    resolver: zodResolver(onboardingUsernameSchema),
    defaultValues: {
      username: "",
      terms: false,
    },
  });

  const onSubmit = (data: OnboardingUsernameNameSchema) => {
    console.log({
      ...data,
      firstName,
      lastName,
      password,
      repeatPassword,
    });
    router.push("/");
  };

  useEffect(() => {
    const unsubscribe = useOnboardingStore.persist.onFinishHydration(() => {
      setHasHydrated(true);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!firstName || !lastName || !password || !repeatPassword) {
      router.push("/onboarding/name");
    }
  }, [hasHydrated, firstName, lastName, router, password, repeatPassword]);

  return (
    <div>
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
        <FieldGroup className="max-w-sm">
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
                    Accept terms and conditions
                  </FieldLabel>
                  <FieldDescription>
                    By clicking this checkbox, you agree to the terms.
                  </FieldDescription>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </FieldContent>
              </Field>
            )}
          />
        </FieldGroup>
        <Field orientation="horizontal">
          <Button type="submit" form="form-rhf-onboarding">
            Submit
          </Button>
        </Field>
      </form>
    </div>
  );
};
