import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccessoryFiltrationComponent } from './accessory-filtration.component';

describe('AccessoryFiltrationComponent', () => {
  let component: AccessoryFiltrationComponent;
  let fixture: ComponentFixture<AccessoryFiltrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AccessoryFiltrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccessoryFiltrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
