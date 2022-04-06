import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ComplaintProductDetailsComponent} from './complaint-product-details.component';

describe('ComplaintProductDetailsComponent', () => {
  let component: ComplaintProductDetailsComponent;
  let fixture: ComponentFixture<ComplaintProductDetailsComponent>;

  beforeEach(waitForAsync(() => {
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
