import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetFiltrationComponent } from './reset-filtration.component';

describe('ResetFiltrationComponent', () => {
  let component: ResetFiltrationComponent;
  let fixture: ComponentFixture<ResetFiltrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetFiltrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetFiltrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
