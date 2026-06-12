export interface Supplier {
  id: number;
  name: string;
  email?: string | null;
  phone?: string | null;
  contact_name?: string | null;
  address?: string | null;
  products_count?: number;
  created_at?: string;
  updated_at?: string;
}

export interface SupplierFilters {
  search?: string;
  hasProducts?: boolean;
}
