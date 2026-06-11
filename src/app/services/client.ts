import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class Client {
  private apiUrl = environment.apiUrl;
  private http = inject(HttpClient);

  constructor() {}

  getClients(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}clients`);
  }
}
