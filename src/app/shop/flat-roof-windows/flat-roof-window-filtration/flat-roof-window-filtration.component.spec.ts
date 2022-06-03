import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlatRoofWindowFiltrationComponent } from './flat-roof-window-filtration.component';

describe('FlatRoofWindowFiltrationComponent', () => {
  let component: FlatRoofWindowFiltrationComponent;
  let fixture: ComponentFixture<FlatRoofWindowFiltrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlatRoofWindowFiltrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlatRoofWindowFiltrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
