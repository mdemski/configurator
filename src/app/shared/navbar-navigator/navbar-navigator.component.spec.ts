import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarNavigatorComponent } from './navbar-navigator.component';

describe('NavbarNavigatorComponent', () => {
  let component: NavbarNavigatorComponent;
  let fixture: ComponentFixture<NavbarNavigatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarNavigatorComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarNavigatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
