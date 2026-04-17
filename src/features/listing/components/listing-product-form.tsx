"use client";

import { z } from "zod";
import { useEffect, useMemo, useState } from "react";
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
import { productSelectionSchema } from "../schema";
import {
  POKEMON_SEALED_PRODUCT_TYPES,
  POKEMON_SEALED_PRODUCT_DISPLAY_NAMES,
  YUGIOH_SEALED_PRODUCT_TYPES,
  YUGIOH_SEALED_PRODUCT_DISPLAY_NAMES,
  PRODUCT_TYPES,
  Brand,
  PokemonSealedProductType,
  YugiohSealedProductType,
} from "@/features/listing.type";
import { useListingStore } from "@/app/listing/store";

const productSchema = productSelectionSchema;
type ProductSchema = z.infer<typeof productSchema>;

export const ListingProductForm = () => {
  const router = useRouter();
  const setData = useListingStore((state) => state.setData);
  const brand = useListingStore(
    (state) => (state as any).brand ?? (state as any).brand,
  );
  const category = useListingStore((state) => (state as any).category);

  const form = useForm<ProductSchema>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      productType: undefined,
      sealedProductType: undefined,
    },
  });

  const sealedOptions = useMemo(() => {
    if (brand === "pokemon") return POKEMON_SEALED_PRODUCT_TYPES;
    if (brand === "yugioh") return YUGIOH_SEALED_PRODUCT_TYPES;
    return [];
  }, [brand]);

  const getSealedProductDisplayName = (
    brand: Brand | undefined,
    option: string,
  ) => {
    if (!brand) return option;

    switch (brand) {
      case "pokemon":
        return (
          POKEMON_SEALED_PRODUCT_DISPLAY_NAMES[
            option as PokemonSealedProductType
          ] || option
        );
      case "yugioh":
        return (
          YUGIOH_SEALED_PRODUCT_DISPLAY_NAMES[
            option as YugiohSealedProductType
          ] || option
        );
      default:
        return option;
    }
  };

  useEffect(() => {
    // Redirect back if brand not chosen
    if (!brand) {
      router.push("/listing/brand");
      return;
    }
    if (!category) {
      router.push("/listing/category");
    }
  }, [brand, category, router]);

  useEffect(() => {
    const handleHydration = () => {
      const state = useListingStore.getState();
      form.reset({
        productType: state.productType,
        sealedProductType: state.sealedProductType,
      });
    };

    if (useListingStore.persist?.hasHydrated()) {
      handleHydration();
    }

    const unsubscribe = useListingStore.persist.onFinishHydration(() => {
      handleHydration();
    });

    return () => unsubscribe();
  }, [form]);

  const onSubmit = (data: ProductSchema) => {
    setData(
      data.productType === "sealed_product"
        ? data
        : { ...data, sealedProductType: undefined },
    );
    router.push("/");
  };

  const showSealedSubtype = form.watch("productType") === "sealed_product";

  return (
    <>
      <span className="text-lg font-semibold">Product Information</span>
      <form
        id="form-listing-product"
        onSubmit={form.handleSubmit(onSubmit)}
        className="w-full space-y-8"
      >
        <FieldSet>
          <FieldLegend>
            Choose the option which accurately describes the product
          </FieldLegend>
          <FieldGroup data-slot="radio-group">
            {PRODUCT_TYPES.map((type) => (
              <Controller
                key={type}
                name="productType"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    orientation="responsive"
                  >
                    <FieldLabel htmlFor={`product-${type}`}>
                      <div className="flex items-center gap-3">
                        <input
                          type="radio"
                          id={`product-${type}`}
                          value={type}
                          checked={field.value === type}
                          onChange={() => field.onChange(type)}
                          onBlur={field.onBlur}
                          name={field.name}
                          className="h-4 w-4"
                        />
                        <FieldContent>
                          <div className="flex items-center gap-2">
                            <span className="capitalize font-medium">
                              {type.replace("_", " ")}
                            </span>
                          </div>
                          <FieldDescription>
                            {type === "sealed_product"
                              ? "Factory sealed items, boxes or bundles"
                              : "Individual cards (graded or raw)"}
                          </FieldDescription>
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

        {showSealedSubtype && (
          <FieldSet>
            <FieldLegend>Choose the product type</FieldLegend>
            <FieldGroup data-slot="radio-group">
              {sealedOptions.map((option) => (
                <Controller
                  key={option}
                  name="sealedProductType"
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field
                      data-invalid={fieldState.invalid}
                      orientation="responsive"
                    >
                      <FieldLabel htmlFor={`sealed-${option}`}>
                        <div className="flex items-center gap-3">
                          <input
                            type="radio"
                            id={`sealed-${option}`}
                            value={option}
                            checked={field.value === option}
                            onChange={() => field.onChange(option)}
                            onBlur={field.onBlur}
                            name={field.name}
                            className="h-4 w-4"
                          />
                          <FieldContent>
                            <span className="font-medium">
                              {getSealedProductDisplayName(
                                brand,
                                option,
                              )}
                            </span>
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
        )}

        <Field orientation="horizontal" className="gap-4">
          <Button
            type="button"
            variant="outline"
            className="ml-auto"
            onClick={() => {
              const formValues = form.getValues();
              setData(formValues);
              router.push("/listing/brand")}
            }
          >
            Back
          </Button>
          <Button type="submit" form="form-listing-product">
            Finish
          </Button>
        </Field>
      </form>
    </>
  );
};
