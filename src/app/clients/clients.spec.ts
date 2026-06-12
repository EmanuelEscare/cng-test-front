import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { of } from 'rxjs';

import { Clients } from './clients';
import { Client } from '../services/client';

describe('Clients', () => {
  let component: Clients;
  let fixture: ComponentFixture<Clients>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clients],
      providers: [
        provideRouter([]),
        {
          provide: Client,
          useValue: {
            getClients: () => of({ data: [] }),
          },
        },
      ],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Clients);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
