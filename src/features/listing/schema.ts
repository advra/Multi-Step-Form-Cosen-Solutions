import { z } from "zod";
import {
  CARD_TYPES,
  FRANCHISES,
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
const refundPolicySchema = z.enum(REFUND_POLICY_OPTIONS.map(o => o.value) as [string, ...string[]]);

export const listingBaseSchema = z.object({
    franchises: z.array(z.enum(FRANCHISES)).min(1),
    productType: productTypeSchema,
    title: z.string().min(10).max(50),
    description: z.string().min(25).max(2000),
    price: z.number().positive(),
    listingType: listingTypeSchema,
    images: z.array(uploaderImageSchema).min(1),
    // shippingDetails: //todo
    refundPolicy: refundPolicySchema,
})

// Sealed details discriminated by franchise
export const sealedProductDetailsSchema = z.discriminatedUnion("franchise", [
  z.object({
    franchise: z.literal("pokemon"),
    sealedProductType: z.enum(POKEMON_SEALED_PRODUCT_TYPES),
    metadata: pokemonSealedMetadataSchema.optional(),
  }),
  z.object({
    franchise: z.literal("yugioh"),
    sealedProductType: z.enum(YUGIOH_SEALED_PRODUCT_TYPES),
    metadata: yugiohSealedMetadataSchema.optional(),
  }),
]);

// Card details discriminated by franchise
const cardDetailsSchemaBase = z.discriminatedUnion("franchise", [
  z.object({
    franchise: z.literal("pokemon"),
    cardType: z.enum(CARD_TYPES),
    metadata: pokemonCardMetadataSchema,
    grading: gradingDetailsSchema.optional(),
  }),
  z.object({
    franchise: z.literal("yugioh"),
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

