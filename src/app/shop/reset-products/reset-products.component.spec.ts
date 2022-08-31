import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetProductsComponent } from './reset-products.component';

describe('ResetProductsComponent', () => {
  let component: ResetProductsComponent;
  let fixture: ComponentFixture<ResetProductsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetProductsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
