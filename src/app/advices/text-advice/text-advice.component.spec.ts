import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TextAdviceComponent } from './text-advice.component';

describe('TextAdviceComponent', () => {
  let component: TextAdviceComponent;
  let fixture: ComponentFixture<TextAdviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TextAdviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TextAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
