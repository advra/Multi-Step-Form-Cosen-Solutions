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
import { Label } from "@/components/ui/label";

const onboardingUsernameSchema = onboardingBaseSchema.pick({
  username: true,
  terms: true,
});

type OnboardingUsernameNameSchema = z.infer<typeof onboardingUsernameSchema>;

export const OnboardingUsernameForm = () => {
  const form = useForm<OnboardingUsernameNameSchema>({
    resolver: zodResolver(onboardingUsernameSchema),
    defaultValues: {
      username: "",
      terms: false,
    },
  });

  const onSubmit = (data: OnboardingUsernameNameSchema) => {
    console.log(data);
  };

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
                <FieldLabel htmlFor="form-rhf-first-name">Username</FieldLabel>
                <Input
                  {...field}
                  id="form-rhf-first-name"
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
                <Checkbox id="terms-checkbox" name="terms-checkbox" />
                <FieldContent>
                  <FieldLabel htmlFor="terms-checkbox">
                    Accept terms and conditions
                  </FieldLabel>
                  <FieldDescription>
                    By clicking this checkbox, you agree to the terms.
                  </FieldDescription>
                </FieldContent>
                {!field.value && <FieldError errors={[fieldState.error]} />}
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
