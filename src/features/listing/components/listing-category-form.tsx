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
import { categorySelectionSchema } from "../schema";
import { CATEGORIES, CATEGORY_DISPLAY_NAMES } from "@/features/listing.type";
import { useListingStore } from "@/app/listing/store";

const categorySchema = categorySelectionSchema;
type CategorySchema = z.infer<typeof categorySchema>;

export const ListingCategoryForm = () => {
  const router = useRouter();
  const setData = useListingStore((state) => state.setData);

  const form = useForm<CategorySchema>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      category: undefined,
    },
  });

  const onSubmit = (data: CategorySchema) => {
    const currentState = useListingStore.getState() as any;
    if(currentState.category === data.category) {
       setData(data);
    } else {
      // Always clear brand and product-related fields when category changes
      setData({
        ...data,
        brand: undefined,
        productType: undefined,
        sealedProductType: undefined,
      });
    }
    router.push("/listing/brand");
  };

  useEffect(() => {
    const handleHydration = () => {
      const state = useListingStore.getState() as any;
      if (state.category) {
        form.reset({ category: state.category });
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
      <span className="text-lg font-semibold">Category Information</span>
      <form
        id="form-listing-category"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <FieldSet>
          <FieldLegend>Choose a category for your listing</FieldLegend>
          <FieldGroup data-slot="radio-group">
            {CATEGORIES.map((category) => (
              <Controller
                key={category}
                name="category"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="responsive"
                  >
                    <FieldLabel htmlFor={`category-${category}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={`category-${category}`}
                          value={category}
                          checked={field.value === category}
                          onChange={() => field.onChange(category)}
                          onBlur={field.onBlur}
                          name={field.name}
                          className="h-4 w-4"
                        />
                        <FieldContent>
                          <div className="flex items-center gap-2">
                            <span className="capitalize font-medium">
                              {CATEGORY_DISPLAY_NAMES[category]}
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

        <Field orientation="horizontal">
          <Button
            type="submit"
            form="form-listing-category"
            className="ml-auto"
          >
            Next
          </Button>
        </Field>
      </form>
    </>
  );
};
