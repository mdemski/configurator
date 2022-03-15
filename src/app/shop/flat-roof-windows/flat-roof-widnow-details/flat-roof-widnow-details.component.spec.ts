import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlatRoofWidnowDetailsComponent} from './flat-roof-widnow-details.component';

describe('FlatRoofWidnowDetailsComponent', () => {
  let component: FlatRoofWidnowDetailsComponent;
  let fixture: ComponentFixture<FlatRoofWidnowDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FlatRoofWidnowDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatRoofWidnowDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
