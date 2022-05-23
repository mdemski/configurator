import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FlashingFiltrationComponent } from './flashing-filtration.component';

describe('FlashingFiltrationComponent', () => {
  let component: FlashingFiltrationComponent;
  let fixture: ComponentFixture<FlashingFiltrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FlashingFiltrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FlashingFiltrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
