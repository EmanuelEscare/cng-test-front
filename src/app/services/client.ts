import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface ClientRecord {
  id: number;
  name: string;
  phone: string;
  email: string;
}

interface ClientResponse {
  data: ClientRecord[];
}

@Injectable({
  providedIn: 'root',
})
export class Client {
  private apiUrl = environment.apiUrl.replace(/\/$/, '');
  private http = inject(HttpClient);

  getClients(): Observable<ClientResponse> {
    return this.http.get<ClientResponse>(`${this.apiUrl}/clients`);
  }
}
