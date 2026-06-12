import { Supplier } from './supplier';

export interface ProductSupplierRelation {
  supplier?: Supplier | null;
  supplier_id?: number | string | null;
  supplier_name?: string | null;
  name?: string | null;
  is_active?: boolean | number | string;
}

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  price: number | string;
  currency: string;
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
