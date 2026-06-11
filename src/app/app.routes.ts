import { Routes } from '@angular/router';
import { Clients } from './clients/clients';
import { Countries } from './countries/countries';

export const routes: Routes = [
  { path: 'clients', component: Clients }, // lista de usuarios
  { path: 'country', component: Countries }, // lista de usuarios
  { path: '', redirectTo: 'clients', pathMatch: 'full' }, // ruta por defecto
  { path: '**', redirectTo: 'clients' }, // fallback para rutas inválidas
];
