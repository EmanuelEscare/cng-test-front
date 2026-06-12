import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { Countries } from './countries';

describe('Countries', () => {
  let component: Countries;
  let fixture: ComponentFixture<Countries>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Countries],
      providers: [provideRouter([])],
    })
    .compileComponents();

    fixture = TestBed.createComponent(Countries);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
