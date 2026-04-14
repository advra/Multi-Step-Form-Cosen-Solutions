"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { franchiseSelectionSchema } from "../schema";
import { FRANCHISES } from "@/features/listing.type";
import { useListingStore } from "@/app/listing/store";
import { useEffect } from "react";

const franchiseSchema = franchiseSelectionSchema;
type FranchiseSchema = z.infer<typeof franchiseSchema>;

export const ListingFranchiseForm = () => {
  const router = useRouter();
  const setData = useListingStore((state) => state.setData);

  const form = useForm<FranchiseSchema>({
    resolver: zodResolver(franchiseSchema),
    defaultValues: {
      franchise: undefined,
    },
  });

  const onSubmit = (data: FranchiseSchema) => {
    setData(data);
    router.push("/listing/product");
  };

  useEffect(() => {
    const handleHydration = () => {
      const state = useListingStore.getState();
      if (state.franchise) {
        form.reset({ franchise: state.franchise });
      }
    };

    if (useListingStore.persist?.hasHydrated()) {
      handleHydration();
    }

    const unsubscribe = useListingStore.persist.onFinishHydration(() => {
      handleHydration();
    });

    return () => unsubscribe();
  }, [form]);

  return (
    <>
      <span className="text-lg font-semibold">Select Franchise</span>
      <form
        id="form-listing-franchise"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <FieldSet>
          <FieldLegend>Choose the franchise for this listing</FieldLegend>
          <FieldGroup data-slot="radio-group">
            {FRANCHISES.map((franchise) => (
              <Controller
                key={franchise}
                name="franchise"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid} orientation="responsive">
                    <FieldLabel htmlFor={`franchise-${franchise}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={`franchise-${franchise}`}
                          value={franchise}
                          checked={field.value === franchise}
                          onChange={() => field.onChange(franchise)}
                          onBlur={field.onBlur}
                          name={field.name}
                          className="h-4 w-4"
                        />
                        <FieldContent>
                          <div className="flex items-center gap-2">
                            <span className="capitalize font-medium">{franchise}</span>
                          </div>
                        </FieldContent>
                      </div>
                    </FieldLabel>
                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
                  </Field>
                )}
              />
            ))}
          </FieldGroup>
        </FieldSet>
        <Field orientation="horizontal">
          <Button type="submit" form="form-listing-franchise" className="ml-auto">
            Next
          </Button>
        </Field>
      </form>
    </>
  );
};