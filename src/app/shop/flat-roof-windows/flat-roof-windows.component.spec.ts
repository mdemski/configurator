import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlatRoofWindowsComponent} from './flat-roof-windows.component';

describe('FlatRoofWindowsComponent', () => {
  let component: FlatRoofWindowsComponent;
  let fixture: ComponentFixture<FlatRoofWindowsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatRoofWindowsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatRoofWindowsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
