import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MyComplaintsComponent} from './my-complaints.component';

describe('MyComplaintsComponent', () => {
  let component: MyComplaintsComponent;
  let fixture: ComponentFixture<MyComplaintsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyComplaintsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyComplaintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
