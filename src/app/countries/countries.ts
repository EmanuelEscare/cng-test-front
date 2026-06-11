import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-countries',
  imports: [ButtonModule],
  templateUrl: './countries.html',
  styleUrl: './countries.scss'
})
export class Countries {
  private route = inject(Router);
  
  goToCountry() {
    this.route.navigate(['/country']);
  }

  goToClients() {
    this.route.navigate(['/clients']);
  }
}
