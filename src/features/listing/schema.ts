import { z } from "zod";
import {
  CARD_TYPES,
  CATEGORIES,
  BRANDS,
  LISTING_TYPES,
  POKEMON_SEALED_PRODUCT_TYPES,
  PRODUCT_TYPES,
  REFUND_POLICY_OPTIONS,
  YUGIOH_SEALED_PRODUCT_TYPES,
  gradingDetailsSchema,
  pokemonCardMetadataSchema,
  pokemonSealedMetadataSchema,
  uploaderImageSchema,
  yugiohCardMetadataSchema,
  yugiohSealedMetadataSchema,
} from "@/features/listing.type";

const productTypeSchema = z.enum(PRODUCT_TYPES);
const listingTypeSchema = z.enum(LISTING_TYPES);
const categorySchema = z.enum(CATEGORIES);

// New category step schema
export const categorySelectionSchema = z.object({
  category: categorySchema,
});
export type CategorySelectionSchema = z.infer<typeof categorySelectionSchema>;

// Step schemas for multi-step listing flow
export const brandSelectionSchema = z.object({
  brand: z.enum(BRANDS),
});
export type BrandSelectionSchema = z.infer<typeof brandSelectionSchema>;

export const productSelectionSchema = z
  .object({
    productType: productTypeSchema,
    sealedProductType: z
      .union([
        z.enum(POKEMON_SEALED_PRODUCT_TYPES),
        z.enum(YUGIOH_SEALED_PRODUCT_TYPES),
      ])
      .optional(),
  })
  .superRefine((val, ctx) => {
    if (val.productType === "sealed_product" && !val.sealedProductType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Select a sealed product type",
        path: ["sealedProductType"],
      });
    }

    if (val.productType !== "sealed_product" && val.sealedProductType) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Sealed product subtype only applies to sealed items",
        path: ["sealedProductType"],
      });
    }
  });
export type ProductSelectionSchema = z.infer<typeof productSelectionSchema>;
const refundPolicySchema = z.enum(REFUND_POLICY_OPTIONS.map(o => o.value) as [string, ...string[]]);

export const listingBaseSchema = z.object({
    category: categorySchema,
    brand: z.enum(BRANDS),
    productType: productTypeSchema,
    title: z.string().min(10).max(50),
    description: z.string().min(25).max(2000),
    price: z.number().positive(),
    listingType: listingTypeSchema,
    images: z.array(uploaderImageSchema).min(1),
    // shippingDetails: //todo
    refundPolicy: refundPolicySchema,
})

// Sealed details discriminated by brand
export const sealedProductDetailsSchema = z.discriminatedUnion("brand", [
  z.object({
    brand: z.literal("pokemon"),
    sealedProductType: z.enum(POKEMON_SEALED_PRODUCT_TYPES),
    metadata: pokemonSealedMetadataSchema.optional(),
  }),
  z.object({
    brand: z.literal("yugioh"),
    sealedProductType: z.enum(YUGIOH_SEALED_PRODUCT_TYPES),
    metadata: yugiohSealedMetadataSchema.optional(),
  }),
]);

// Card details discriminated by brand
const cardDetailsSchemaBase = z.discriminatedUnion("brand", [
  z.object({
    brand: z.literal("pokemon"),
    cardType: z.enum(CARD_TYPES),
    metadata: pokemonCardMetadataSchema,
    grading: gradingDetailsSchema.optional(),
  }),
  z.object({
    brand: z.literal("yugioh"),
    cardType: z.enum(CARD_TYPES),
    metadata: yugiohCardMetadataSchema,
    grading: gradingDetailsSchema.optional(),
  }),
]);

// Require grading when cardType is graded
export const cardDetailsSchema = cardDetailsSchemaBase.superRefine((val, ctx) => {
  if (val.cardType === "graded" && !val.grading) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "grading is required when cardType is graded",
      path: ["grading"],
    });
  }
});

// Full listing discriminated by productType, extending the base
export const sealedListingSchema = listingBaseSchema.extend({
  productType: z.literal("sealed_product"),
  sealedProductDetails: sealedProductDetailsSchema,
});

export const cardListingSchema = listingBaseSchema.extend({
  productType: z.literal("card"),
  cardDetails: cardDetailsSchema,
});

export const listingSchema = z.discriminatedUnion("productType", [
  sealedListingSchema,
  cardListingSchema,
]);

export type ListingSchema = z.infer<typeof listingSchema>;

