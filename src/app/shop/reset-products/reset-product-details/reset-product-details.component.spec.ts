import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetProductDetailsComponent } from './reset-product-details.component';

describe('ResetProductDetailsComponent', () => {
  let component: ResetProductDetailsComponent;
  let fixture: ComponentFixture<ResetProductDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetProductDetailsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
