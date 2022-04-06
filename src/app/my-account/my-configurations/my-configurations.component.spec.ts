import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {MyConfigurationsComponent} from './my-configurations.component';

describe('MyConfigurationsComponent', () => {
  let component: MyConfigurationsComponent;
  let fixture: ComponentFixture<MyConfigurationsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ MyConfigurationsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyConfigurationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
