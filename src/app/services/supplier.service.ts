import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ApiCollectionResponse } from '../models/api-response';
import { Supplier, SupplierFilters } from '../models/supplier';

@Injectable({
  providedIn: 'root',
})
export class SupplierService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = environment.apiUrl.replace(/\/$/, '');
  private readonly acceptHeaders = new HttpHeaders({
    Accept: 'application/json',
  });

  getSuppliers(filters: SupplierFilters = {}): Observable<ApiCollectionResponse<Supplier>> {
    return this.http.get<ApiCollectionResponse<Supplier>>(`${this.apiUrl}/suppliers`, {
      headers: this.acceptHeaders,
      params: this.buildSupplierParams(filters),
    });
  }

  private buildSupplierParams(filters: SupplierFilters): HttpParams {
    let params = new HttpParams();

    if (filters.search) {
      params = params.set('search', filters.search);
    }

    if (filters.hasProducts !== undefined) {
      params = params.set('has_products', String(filters.hasProducts));
    }

    return params;
  }
}
