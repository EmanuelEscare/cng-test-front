import { Routes } from '@angular/router';
import { Clients } from './clients/clients';
import { Countries } from './countries/countries';
import { Products } from './products/products';

export const routes: Routes = [
  { path: 'products', component: Products },
  { path: 'clients', component: Clients }, // lista de usuarios
  { path: 'country', component: Countries }, // lista de usuarios
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  { path: '**', redirectTo: 'products' },
];
