import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ComplaintProductDetailsComponent } from './complaint-product-details.component';

describe('ComplaintProductDetailsComponent', () => {
  let component: ComplaintProductDetailsComponent;
  let fixture: ComponentFixture<ComplaintProductDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComplaintProductDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ComplaintProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
