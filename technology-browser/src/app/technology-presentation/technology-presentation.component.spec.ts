import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TechnologyPresentationComponent } from './technology-presentation.component';

describe('TechnologyPresentationComponent', () => {
  let component: TechnologyPresentationComponent;
  let fixture: ComponentFixture<TechnologyPresentationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TechnologyPresentationComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TechnologyPresentationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
