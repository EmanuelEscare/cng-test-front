import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, DestroyRef, OnInit, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { debounceTime, finalize, Subject } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

import { PaginationMeta } from '../models/api-response';
import { Product, ProductFilters, ProductPayload } from '../models/product';
import { Supplier } from '../models/supplier';
import { ProductService } from '../services/product.service';
import { SupplierService } from '../services/supplier.service';

interface ProductFilterForm {
  search: string;
  supplierId: number | null;
  isActive: boolean;
}

interface ProductForm {
  id: number | null;
  name: string;
  sku: string;
  description: string;
  price: number | null;
  currency: string;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, ButtonModule, TableModule],
  templateUrl: './products.html',
  styleUrl: './products.scss',
})
export class Products implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly supplierService = inject(SupplierService);
  private readonly destroyRef = inject(DestroyRef);
  private readonly searchChanges = new Subject<void>();

  protected readonly products = signal<Product[]>([]);
  protected readonly suppliers = signal<Supplier[]>([]);
  protected readonly selectedProduct = signal<Product | null>(null);
  protected readonly paginationMeta = signal<PaginationMeta | null>(null);
  protected readonly isLoading = signal(false);
  protected readonly isSaving = signal(false);
  protected readonly errorMessage = signal('');
  protected readonly successMessage = signal('');
  protected readonly listModeLabel = signal('Todos');
  protected readonly totalProducts = computed(() => {
    return this.paginationMeta()?.total ?? this.products().length;
  });

  protected readonly filters: ProductFilterForm = {
    search: '',
    supplierId: null,
    isActive: false,
  };

  protected readonly productForm: ProductForm = this.getEmptyProductForm();

  ngOnInit(): void {
    this.loadSuppliers();
    this.loadProducts();
    this.searchChanges
      .pipe(debounceTime(350), takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.loadProducts());
  }

  protected applySupplierFilter(supplierId: number | null): void {
    this.filters.supplierId = supplierId;
    this.loadProducts();
  }

  protected applyActiveFilter(isActive: boolean): void {
    this.filters.isActive = isActive;
    this.loadProducts();
  }

  protected queueSearch(search: string): void {
    this.filters.search = search;
    this.searchChanges.next();
  }

  protected clearFilters(): void {
    this.filters.search = '';
    this.filters.supplierId = null;
    this.filters.isActive = false;
    this.loadProducts();
  }

  protected showProduct(product: Product): void {
    this.clearMessages();
    this.isLoading.set(true);

    this.productService
      .getProduct(product.id)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.selectedProduct.set(response.data);
          this.fillProductForm(response.data);
        },
        error: (error: unknown) => {
          this.handleError(error, 'No se pudo cargar el detalle del producto.');
        },
      });
  }

  protected createProduct(): void {
    const payload = this.getProductPayload();

    if (!payload) {
      return;
    }

    this.clearMessages();
    this.isSaving.set(true);

    this.productService
      .createProduct(payload)
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.selectedProduct.set(response.data);
          this.fillProductForm(response.data);
          this.successMessage.set('Producto creado correctamente.');
          this.loadProducts();
        },
        error: (error: unknown) => {
          this.handleError(error, 'No se pudo crear el producto.');
        },
      });
  }

  protected patchProduct(): void {
    const productId = this.getSelectedProductId();
    const payload = this.getProductPayload();

    if (!productId || !payload) {
      this.errorMessage.set('Selecciona un producto antes de actualizar.');
      return;
    }

    this.clearMessages();
    this.isSaving.set(true);

    this.productService
      .updateProduct(productId, payload)
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.selectedProduct.set(response.data);
          this.fillProductForm(response.data);
          this.successMessage.set('Producto actualizado correctamente.');
          this.loadProducts();
        },
        error: (error: unknown) => {
          this.handleError(error, 'No se pudo actualizar el producto.');
        },
      });
  }

  protected replaceProduct(): void {
    const productId = this.getSelectedProductId();
    const payload = this.getProductPayload();

    if (!productId || !payload) {
      this.errorMessage.set('Selecciona un producto antes de reemplazar.');
      return;
    }

    this.clearMessages();
    this.isSaving.set(true);

    this.productService
      .replaceProduct(productId, payload)
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.selectedProduct.set(response.data);
          this.fillProductForm(response.data);
          this.successMessage.set('Producto reemplazado correctamente.');
          this.loadProducts();
        },
        error: (error: unknown) => {
          this.handleError(error, 'No se pudo reemplazar el producto.');
        },
      });
  }

  protected deleteProduct(): void {
    const productId = this.getSelectedProductId();

    if (!productId) {
      this.errorMessage.set('Selecciona un producto antes de eliminar.');
      return;
    }

    const shouldDelete = window.confirm('¿Deseas eliminar este producto?');

    if (!shouldDelete) {
      return;
    }

    this.clearMessages();
    this.isSaving.set(true);

    this.productService
      .deleteProduct(productId)
      .pipe(
        finalize(() => this.isSaving.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: () => {
          this.resetForm();
          this.successMessage.set('Producto eliminado correctamente.');
          this.loadProducts();
        },
        error: (error: unknown) => {
          this.handleError(error, 'No se pudo eliminar el producto.');
        },
      });
  }

  protected resetForm(): void {
    Object.assign(this.productForm, this.getEmptyProductForm());
    this.selectedProduct.set(null);
    this.clearMessages();
  }

  protected formatPrice(product: Product): string {
    const price = Number(product.price);

    if (Number.isNaN(price)) {
      return `${product.price} ${product.currency}`;
    }

    try {
      return new Intl.NumberFormat('es-MX', {
        style: 'currency',
        currency: product.currency || 'MXN',
      }).format(price);
    } catch {
      return `${price.toFixed(2)} ${product.currency}`;
    }
  }

  protected formatDate(value: string | undefined): string {
    if (!value) {
      return '-';
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return value;
    }

    return new Intl.DateTimeFormat('es-MX', {
      dateStyle: 'medium',
      timeStyle: 'short',
    }).format(date);
  }

  protected getSupplierNames(product: Product): string {
    const supplierNames = new Set<string>();

    product.suppliers?.forEach((supplier) => this.addSupplierName(supplierNames, supplier));
    this.addSupplierName(supplierNames, product.supplier);
    this.addName(supplierNames, product.supplier_name);
    this.addSupplierNameFromId(supplierNames, product.supplier_id);
    product.supplier_ids?.forEach((supplierId) => this.addSupplierNameFromId(supplierNames, supplierId));

    if (product.product_supplier) {
      this.addSupplierRelationName(supplierNames, product.product_supplier);
    }

    product.product_suppliers?.forEach((relation) => {
      this.addSupplierRelationName(supplierNames, relation);
    });

    if (supplierNames.size > 0) {
      return Array.from(supplierNames).join(', ');
    }

    const selectedSupplierName = this.getSelectedSupplierName();

    if (selectedSupplierName) {
      return selectedSupplierName;
    }

    if ((product.suppliers_count ?? product.supplier_count ?? 0) > 0) {
      return 'Proveedor asignado';
    }

    return 'Sin proveedor';
  }

  private loadProducts(): void {
    const filters = this.resolveProductFilters();

    this.clearMessages();
    this.listModeLabel.set(this.getCurrentListModeLabel());
    this.isLoading.set(true);

    this.productService
      .getProducts(filters)
      .pipe(
        finalize(() => this.isLoading.set(false)),
        takeUntilDestroyed(this.destroyRef),
      )
      .subscribe({
        next: (response) => {
          this.products.set(response.data);
          this.paginationMeta.set(response.meta ?? null);
        },
        error: (error: unknown) => {
          this.products.set([]);
          this.paginationMeta.set(null);
          this.handleError(error, 'No se pudieron cargar los productos.');
        },
      });
  }

  private loadSuppliers(): void {
    this.supplierService
      .getSuppliers()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.suppliers.set(response.data);
        },
        error: (error: unknown) => {
          this.handleError(error, 'No se pudieron cargar los proveedores.');
        },
      });
  }

  private resolveProductFilters(): ProductFilters {
    const filters: ProductFilters = {};
    const search = this.filters.search.trim();

    if (search) {
      filters.search = search;
    }

    if (this.filters.supplierId) {
      filters.supplierId = this.filters.supplierId;
    }

    if (this.filters.isActive) {
      filters.isActive = true;
    }

    return filters;
  }

  private getCurrentListModeLabel(): string {
    if (this.filters.supplierId && this.filters.isActive) {
      return 'Activos por proveedor';
    }

    if (this.filters.supplierId) {
      return 'Por proveedor';
    }

    if (this.filters.isActive) {
      return 'Activos';
    }

    if (this.filters.search.trim()) {
      return 'Búsqueda';
    }

    return 'Todos';
  }

  private addSupplierRelationName(
    supplierNames: Set<string>,
    relation: Product['product_supplier'],
  ): void {
    if (!relation) {
      return;
    }

    this.addSupplierName(supplierNames, relation.supplier);
    this.addName(supplierNames, relation.supplier_name);
    this.addName(supplierNames, relation.name);
    this.addSupplierNameFromId(supplierNames, relation.supplier_id);
  }

  private addSupplierName(supplierNames: Set<string>, supplier: Supplier | null | undefined): void {
    this.addName(supplierNames, supplier?.name);
  }

  private addSupplierNameFromId(
    supplierNames: Set<string>,
    supplierId: number | string | null | undefined,
  ): void {
    const supplierName = this.findSupplierNameById(supplierId);

    if (supplierName) {
      supplierNames.add(supplierName);
    }
  }

  private addName(supplierNames: Set<string>, supplierName: string | null | undefined): void {
    const normalizedName = supplierName?.trim();

    if (normalizedName) {
      supplierNames.add(normalizedName);
    }
  }

  private findSupplierNameById(supplierId: number | string | null | undefined): string | undefined {
    if (supplierId === null || supplierId === undefined) {
      return undefined;
    }

    return this.suppliers().find((supplier) => String(supplier.id) === String(supplierId))?.name;
  }

  private getSelectedSupplierName(): string | undefined {
    return this.findSupplierNameById(this.filters.supplierId);
  }

  private getProductPayload(): ProductPayload | null {
    const name = this.productForm.name.trim();
    const sku = this.productForm.sku.trim();
    const currency = this.productForm.currency.trim().toUpperCase() || 'MXN';
    const description = this.productForm.description.trim();

    if (!name || !sku || this.productForm.price === null) {
      this.errorMessage.set('Nombre, SKU y precio son obligatorios.');
      return null;
    }

    return {
      name,
      sku,
      description: description || null,
      price: Number(this.productForm.price),
      currency,
    };
  }

  private fillProductForm(product: Product): void {
    this.productForm.id = product.id;
    this.productForm.name = product.name;
    this.productForm.sku = product.sku;
    this.productForm.description = product.description ?? '';
    this.productForm.price = Number(product.price);
    this.productForm.currency = product.currency;
  }

  private getSelectedProductId(): number | null {
    return this.productForm.id ?? this.selectedProduct()?.id ?? null;
  }

  private getEmptyProductForm(): ProductForm {
    return {
      id: null,
      name: '',
      sku: '',
      description: '',
      price: null,
      currency: 'MXN',
    };
  }

  private clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }

  private handleError(error: unknown, fallbackMessage: string): void {
    console.error(fallbackMessage, error);
    this.errorMessage.set(this.getErrorMessage(error, fallbackMessage));
  }

  private getErrorMessage(error: unknown, fallbackMessage: string): string {
    if (error instanceof HttpErrorResponse && typeof error.error === 'object' && error.error) {
      const apiError = error.error as { message?: unknown };

      if (typeof apiError.message === 'string') {
        return apiError.message;
      }
    }

    return fallbackMessage;
  }
}
