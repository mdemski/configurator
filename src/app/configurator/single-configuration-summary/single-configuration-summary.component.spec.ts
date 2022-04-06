import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {SingleConfigurationSummaryComponent} from './single-configuration-summary.component';

describe('SingleConfigurationSummaryComponent', () => {
  let component: SingleConfigurationSummaryComponent;
  let fixture: ComponentFixture<SingleConfigurationSummaryComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleConfigurationSummaryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleConfigurationSummaryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
