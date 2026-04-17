"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import {
  Field,
  FieldContent,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Button } from "@/components/ui/button";
import { brandSelectionSchema } from "../schema";
import { BRANDS, BRAND_DISPLAY_NAMES } from "@/features/listing.type";
import { useListingStore } from "@/app/listing/store";

const brandSchema = brandSelectionSchema;
type BrandSchema = z.infer<typeof brandSchema>;

export const ListingBrandForm = () => {
  const router = useRouter();
  const setData = useListingStore((state) => state.setData);
  const category = useListingStore((state) => (state as any).category);

  const form = useForm<BrandSchema>({
    resolver: zodResolver(brandSchema),
    defaultValues: {
      brand: undefined,
    },
  });

  const onSubmit = (data: BrandSchema) => {
    setData(data);
    router.push("/listing/product");
  };

  useEffect(() => {
    // redirect if category not selected
    if (!category) {
      router.push("/listing/category");
    }
  }, [category, router]);

  useEffect(() => {
    const handleHydration = () => {
      const state = useListingStore.getState() as any;
      if (state.brand) {
        form.reset({
          brand: state.brand,
        });
        return;
      }

      // backward compatibility: previously stored `brand`
      if (state.brand) {
        form.reset({ brand: state.brand });
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
      <span className="text-lg font-semibold">Brand Information</span>
      <form
        id="form-listing-brand"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <FieldSet>
          <FieldLegend>Choose the primary brand for this listing</FieldLegend>
          <FieldGroup data-slot="radio-group">
            {BRANDS.map((brand) => (
              <Controller
                key={brand}
                name="brand"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="responsive"
                  >
                    <FieldLabel htmlFor={`brand-${brand}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={`brand-${brand}`}
                          value={brand}
                          checked={field.value === brand}
                          onChange={() => field.onChange(brand)}
                          onBlur={field.onBlur}
                          name={field.name}
                          className="h-4 w-4"
                        />
                        <FieldContent>
                          <div className="flex items-center gap-2">
                            <span className="font-medium">
                              {BRAND_DISPLAY_NAMES[brand]}
                            </span>
                          </div>
                        </FieldContent>
                      </div>
                    </FieldLabel>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            ))}
          </FieldGroup>
        </FieldSet>

        <Field orientation="horizontal" className="gap-4">
          <Button
            type="button"
            variant="outline"
            className="ml-auto"
            onClick={() => {
              const formValues = form.getValues();
              setData(formValues);
              router.push("/listing/category")
            }}
          >
            Back
          </Button>
          <Button type="submit" form="form-listing-brand">
            Next
          </Button>
        </Field>
      </form>
    </>
  );
};
