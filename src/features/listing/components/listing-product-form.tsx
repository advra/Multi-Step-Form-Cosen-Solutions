"use client";

import { z } from "zod";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useMemo } from "react";

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
  Franchise,
  PokemonSealedProductType,
  YugiohSealedProductType,
} from "@/features/listing.type";
import { useListingStore } from "@/app/listing/store";

const productSchema = productSelectionSchema;
type ProductSchema = z.infer<typeof productSchema>;

export const ListingProductForm = () => {
  const router = useRouter();
  const setData = useListingStore((state) => state.setData);
  const primaryFranchise = useListingStore(
    (state) => (state as any).primaryFranchise ?? (state as any).franchise,
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
    if (primaryFranchise === "pokemon") return POKEMON_SEALED_PRODUCT_TYPES;
    if (primaryFranchise === "yugioh") return YUGIOH_SEALED_PRODUCT_TYPES;
    return [];
  }, [primaryFranchise]);

  const getSealedProductDisplayName = (
    franchise: Franchise | undefined,
    option: string,
  ) => {
    if (!franchise) return option;

    switch (franchise) {
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
    // Redirect back if franchise not chosen
    if (!primaryFranchise) {
      router.push("/listing/franchise");
      return;
    }
    if (!category) {
      router.push("/listing/category");
    }
  }, [primaryFranchise, category, router]);

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
    setData(data);
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
                                primaryFranchise,
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
            onClick={() => router.push("/listing/franchise")}
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
