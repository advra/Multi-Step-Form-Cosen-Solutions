// product.type.ts
import { z } from "zod";

export const PRODUCT_TYPES = ["sealed_product", "card"] as const;
export type ProductType = (typeof PRODUCT_TYPES)[number];

export const POKEMON_SEALED_PRODUCT_TYPES = ["booster_box", "booster_bundle", "etb", "etb_pkc", "blister_pack", "booster_pack"] as const;
export type PokemonSealedProductType = (typeof POKEMON_SEALED_PRODUCT_TYPES)[number];

export const YUGIOH_SEALED_PRODUCT_TYPES = ["booster_box", "blister_pack", "booster_pack"] as const;
export type YugiohSealedProductType = (typeof YUGIOH_SEALED_PRODUCT_TYPES)[number];


// Multi-franchise support (can be extended later, keep snake_case)
export const FRANCHISES = ["pokemon", "yugioh"] as const;
export type Franchise = (typeof FRANCHISES)[number];

// Card conditions/types
export const CARD_TYPES = ["graded", "raw"] as const;
export type CardType = (typeof CARD_TYPES)[number];

// Sealed subtypes (franchise specific)
export const POKEMON_SEALED_TYPES = [
  "booster_box",
  "booster_bundle",
  "etb",
  "etb_pokemon_center",
  "single_pack",
] as const;
export type PokemonSealedType = (typeof POKEMON_SEALED_TYPES)[number];

export const YUGIOH_SEALED_TYPES = [
  "booster_box",
  "booster_pack",
  "structure_deck",
  "tin",
  "special_edition",
  "collectors_box",
  "single_pack",
] as const;
export type YugiohSealedType = (typeof YUGIOH_SEALED_TYPES)[number];

export const LISTING_TYPES = ["buy_it_now", "bid_or_buy", "bid"] as const;
export type ListingType = (typeof LISTING_TYPES)[number];

export type UploaderImage = {
  id: string;
  file?: File; // File object for new uploads
  url: string; // Preview URL (blob URL) or existing URL
  isCover: boolean; // Primary image
};
export const uploaderImageSchema = z.object({
  id: z.string(),
  file: z.instanceof(File).optional(),
  url: z.string().url(),
  isCover: z.boolean(),
});

// Shared grading details for graded cards
export type GradingDetails = {
  gradingCompany: string;
  grade: string;
  certNumber?: string;
};
export const gradingDetailsSchema = z.object({
  gradingCompany: z.string().min(1),
  grade: z.string().min(1),
  certNumber: z.string().min(1).optional(),
});

// Pokemon card/sealed metadata (provided)
export type PokemonCardMetadata = {
  card: {
    language: string;
    id: string;
    localId: string;
    name: string;
    image?: string;
    category: string;
    illustrator?: string;
    rarity?: string;
  };
  set: {
    id: string;
    name: string;
    countTotal: number;
    countOfficialTotal: number;
    releaseDate?: string;
    logo: string;
  };
  serie: {
    id?: string;
    name?: string;
  };
  source: {
    name: string;
  };
};

export type PokemonSealedMetadata = PokemonCardMetadata & {
  sealedType: PokemonSealedType;
};

export const pokemonCardMetadataSchema = z.object({
  card: z.object({
    language: z.string(),
    id: z.string(),
    localId: z.string(),
    name: z.string(),
    image: z.string().url().optional(),
    category: z.string(),
    illustrator: z.string().optional(),
    rarity: z.string().optional(),
  }),
  set: z.object({
    id: z.string(),
    name: z.string(),
    countTotal: z.number(),
    countOfficialTotal: z.number(),
    releaseDate: z.string().optional(),
    logo: z.string(),
  }),
  serie: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }),
  source: z.object({
    name: z.string(),
  }),
});

export const pokemonSealedMetadataSchema = pokemonCardMetadataSchema.extend({
  sealedType: z.enum(POKEMON_SEALED_TYPES),
});

// Yugioh card/sealed metadata (TCGplayer-style fields)
export type YugiohCardMetadata = {
  card: {
    language: string;
    id: string; // e.g., passcode/card id
    number: string; // e.g., set number / card number
    name: string;
    image?: string;
    category: string; // e.g., Monster/Spell/Trap
    rarity?: string;
    rarityCode?: string;
    archetype?: string;
    attribute?: string; // e.g., DARK, LIGHT
    type?: string; // e.g., Dragon/Effect
    level?: number;
    atk?: number;
    def?: number;
  };
  set: {
    id: string; // e.g., set code
    name: string;
    releaseDate?: string;
    logo?: string;
  };
  serie: {
    id?: string;
    name?: string;
  };
  source: {
    name: string;
  };
};

export type YugiohSealedMetadata = YugiohCardMetadata & {
  sealedType: YugiohSealedType;
};

export const yugiohCardMetadataSchema = z.object({
  card: z.object({
    language: z.string(),
    id: z.string(),
    number: z.string(),
    name: z.string(),
    image: z.string().url().optional(),
    category: z.string(),
    rarity: z.string().optional(),
    rarityCode: z.string().optional(),
    archetype: z.string().optional(),
    attribute: z.string().optional(),
    type: z.string().optional(),
    level: z.number().optional(),
    atk: z.number().optional(),
    def: z.number().optional(),
  }),
  set: z.object({
    id: z.string(),
    name: z.string(),
    releaseDate: z.string().optional(),
    logo: z.string().optional(),
  }),
  serie: z.object({
    id: z.string().optional(),
    name: z.string().optional(),
  }),
  source: z.object({
    name: z.string(),
  }),
});

export const yugiohSealedMetadataSchema = yugiohCardMetadataSchema.extend({
  sealedType: z.enum(YUGIOH_SEALED_TYPES),
});

// Extended ShippingDetails for form data with caching fields
export type ShippingDetails = {
    /**
     * Choose how buyers can receive this item
     */
    deliveryType: 'SHIPPING_OR_PICKUP' | 'SHIPPING_ONLY' | 'PICKUP_ONLY';
    /**
     * Choose who pays for shipping costs
     */
    shippingPayer: 'buyer' | 'seller';
    /**
     * Flat rate shipping fee (if buyer pays)
     */
    flatRateShipping?: number | null;
    packageDetails?: {
      /**
       * Weight in pounds
       */
      weight?: number | null;
      /**
       * Length in inches
       */
      length?: number | null;
      /**
       * Width in inches
       */
      width?: number | null;
      /**
       * Height in inches
       */
      height?: number | null;
    };
    /**
     * Available shipping services
     */
    shippingServices?: ('USPS' | 'UPS' | 'FEDEX' | 'DHL')[] | null;
    /**
     * Optional per-service overrides (display name, description, code).
     */
    shippingServiceOptions?:
      | {
          /**
           * Base shipping service (e.g. USPS Priority, UPS Ground, etc.)
           */
          provider: 'USPS' | 'UPS' | 'FEDEX' | 'DHL';
          /**
           * From Shippo ie FASTEST, BESTVALUE, CHEAPEST or empty
           */
          attributes?: string[] | null;
          /**
           * From Shippo the display name to show in front end
           */
          serviceName: string;
          /**
           * From Shippo a unique token used to purchase labels
           */
          serviceToken: string;
          /**
           * From Shippo. Description of the terms
           */
          durationTerms?: string | null;
          id?: string | null;
          blockName?: string | null;
          blockType: 'shippingServiceOption';
        }[]
      | null;
    pickupLocation?: {
      /**
       * ZIP code for pickup location
       */
      zipCode?: string | null;
    };
  };

export type ShippingServiceOption = {
  provider: string;
  attributes: string[];
  serviceName: string;
  serviceToken: string;
  durationTerms?: string;
  price: number;
  currency: string;
};

export type ShippingDetailsWithCache = ShippingDetails & {
  cachedShippingRates?: ShippingServiceOption[];
  selectedShippingServiceTokens?: string[];
  shippingRatesCachedAt?: string;
};

export const REFUND_POLICY_OPTIONS = [
  { label: '30 Day', value: '30_day' },
  { label: '14 Day', value: '14_day' },
  { label: '7 Day', value: '7_day' },
  { label: 'No Refunds', value: 'no_refunds' },
] as const;

export type RefundPolicy = (typeof REFUND_POLICY_OPTIONS)[number]['value'];