import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoAdviceComponent } from './video-advice.component';

describe('VideoAdviceComponent', () => {
  let component: VideoAdviceComponent;
  let fixture: ComponentFixture<VideoAdviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VideoAdviceComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoAdviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
