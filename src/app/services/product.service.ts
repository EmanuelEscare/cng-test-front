import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import {
  ApiCollectionResponse,
  ApiItemResponse,
  ApiMessageResponse,
} from '../models/api-response';
import { Product, ProductFilters, ProductPayload, ProductUpdatePayload } from '../models/product';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl.replace(/\/$/, '');
  private readonly jsonHeaders = new HttpHeaders({
    Accept: 'application/json',
    'Content-Type': 'application/json',
  });
  private readonly acceptHeaders = new HttpHeaders({
    Accept: 'application/json',
  });

  getProducts(filters: ProductFilters = {}): Observable<ApiCollectionResponse<Product>> {
    return this.http.get<ApiCollectionResponse<Product>>(`${this.apiUrl}/products`, {
      headers: this.acceptHeaders,
      params: this.buildProductParams(filters),
    });
  }

  getProduct(productId: number): Observable<ApiItemResponse<Product>> {
    return this.http.get<ApiItemResponse<Product>>(`${this.apiUrl}/products/${productId}`, {
      headers: this.acceptHeaders,
    });
  }

  createProduct(payload: ProductPayload): Observable<ApiItemResponse<Product>> {
    return this.http.post<ApiItemResponse<Product>>(`${this.apiUrl}/products`, payload, {
      headers: this.jsonHeaders,
    });
  }

  updateProduct(
    productId: number,
    payload: ProductUpdatePayload,
  ): Observable<ApiItemResponse<Product>> {
    return this.http.patch<ApiItemResponse<Product>>(`${this.apiUrl}/products/${productId}`, payload, {
      headers: this.jsonHeaders,
    });
  }

  replaceProduct(productId: number, payload: ProductPayload): Observable<ApiItemResponse<Product>> {
    return this.http.put<ApiItemResponse<Product>>(`${this.apiUrl}/products/${productId}`, payload, {
      headers: this.jsonHeaders,
    });
  }

  deleteProduct(productId: number): Observable<ApiMessageResponse | null> {
    return this.http.delete<ApiMessageResponse | null>(`${this.apiUrl}/products/${productId}`, {
      headers: this.acceptHeaders,
    });
  }

  private buildProductParams(filters: ProductFilters): HttpParams {
    let params = new HttpParams();

    params = this.setParam(params, 'search', filters.search);
    params = this.setParam(params, 'supplier_id', filters.supplierId);
    params = this.setParam(params, 'is_active', filters.isActive);

    return params;
  }

  private setParam(
    params: HttpParams,
    key: string,
    value: string | number | boolean | undefined,
  ): HttpParams {
    if (value === undefined || value === '') {
      return params;
    }

    return params.set(key, String(value));
  }
}
