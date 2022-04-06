import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {OkpolLoaderComponent} from './okpol-loader.component';

describe('OkpolLoaderComponent', () => {
  let component: OkpolLoaderComponent;
  let fixture: ComponentFixture<OkpolLoaderComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ OkpolLoaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OkpolLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
