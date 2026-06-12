import { Supplier } from './supplier';

export interface ProductSupplierRelation {
  supplier?: Supplier | null;
  supplier_id?: number | string | null;
  supplier_name?: string | null;
  name?: string | null;
  is_active?: boolean | number | string;
}

export interface ActivePromotion {
  id: number;
  promotion: string;
  discount_percentage: number | string;
  promotion_started_at?: string | null;
  promotion_ends_at?: string | null;
  is_active: boolean | number | string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  price: number | string;
  currency: string;
  has_active_promotion?: boolean | number | string;
  discount_percentage?: number | string | null;
  discounted_price?: number | string | null;
  final_price?: number | string | null;
  active_promotion?: ActivePromotion | null;
  suppliers?: Supplier[];
  supplier?: Supplier | null;
  supplier_id?: number | string | null;
  supplier_ids?: Array<number | string>;
  supplier_name?: string | null;
  supplier_count?: number;
  suppliers_count?: number;
  product_supplier?: ProductSupplierRelation | null;
  product_suppliers?: ProductSupplierRelation[];
  created_at?: string;
  updated_at?: string;
}

export interface ProductPayload {
  name: string;
  sku: string;
  description: string | null;
  price: number;
  currency: string;
}

export type ProductUpdatePayload = Partial<ProductPayload>;

export interface ProductFilters {
  search?: string;
  supplierId?: number;
  isActive?: boolean;
}
