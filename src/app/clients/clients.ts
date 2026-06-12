import { Component, inject } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { Client, ClientRecord } from '../services/client';
import { Router } from '@angular/router';

@Component({
  selector: 'app-clients',
  imports: [ButtonModule, TableModule],
  templateUrl: './clients.html',
  styleUrl: './clients.scss',
})
export class Clients {
  private clientService = inject(Client);
  private route = inject(Router);

  public clients: ClientRecord[] = [];

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients() {
    this.clientService.getClients().subscribe({
      next: (res) => {
        this.clients = res.data;
      },
      error: (err: unknown) => {
        console.error('Error fetching clients:', err);
        this.clients = [];
      },
    });
  }

  goToCountry() {
    this.route.navigate(['/country']);
  }

  goToClients() {
    this.route.navigate(['/clients']);
  }
}
