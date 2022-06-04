import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FlatRoofWindowDetailsComponent} from './flat-roof-window-details.component';

describe('FlatRoofWidnowDetailsComponent', () => {
  let component: FlatRoofWindowDetailsComponent;
  let fixture: ComponentFixture<FlatRoofWindowDetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatRoofWindowDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatRoofWindowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
