import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SkylightFiltrationComponent } from './skylight-filtration.component';

describe('SkylightFiltrationComponent', () => {
  let component: SkylightFiltrationComponent;
  let fixture: ComponentFixture<SkylightFiltrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SkylightFiltrationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SkylightFiltrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
