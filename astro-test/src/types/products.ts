import type { Slug } from "./links";
import type { SEOPage } from "./seo";
import type { Sections } from "./sections";

// ==============================
// Products
// ==============================

export type ProductStatus = "active" | "archived" | "draft";

export interface ProductOption {
  name: string;
  values: string[];
}

export interface PriceRange {
  minVariantPrice: number;
  maxVariantPrice: number;
}

export interface ProductStore {
  createdAt: string;
  updatedAt: string;
  status: ProductStatus;
  isDeleted: boolean;
  title: string;
  id: number;
  gid: string;
  slug: Slug;
  descriptionHtml: string;
  productType: string;
  vendor: string;
  tags: string;
  priceRange: PriceRange;
  previewImageUrl: string;
  options: ProductOption[];
  variants: Array<{
    _type: "reference";
    _ref: string;
  }>;
}

export interface ProductDetails {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: "product";
  _updatedAt: string;
  store: ProductStore;
  sections: Sections;
  seo: SEOPage;
}

export interface Inventory {
  isAvailable: boolean;
  management: string;
  policy: string;
}

export interface ProductVariantStore {
  createdAt: string;
  updatedAt: string;
  status: ProductStatus;
  isDeleted: boolean;
  title: string;
  sku: string;
  id: number;
  gid: string;
  productId: number;
  productGid: string;
  price: number;
  compareAtPrice: number;
  inventory: Inventory;
  option1?: string;
  option2?: string;
  option3?: string;
  previewImageUrl: string;
}

export interface ProductVariant {
  _createdAt: string;
  _id: string;
  _rev: string;
  _type: "productVariant";
  _updatedAt: string;
  store: ProductVariantStore;
}

export type ProductData = {
  details: ProductDetails;
  variants: ProductVariant[];
};
