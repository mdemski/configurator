import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FlashingsComponent} from './flashings.component';

describe('FlashingsComponent', () => {
    let component: FlashingsComponent;
    let fixture: ComponentFixture<FlashingsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FlashingsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlashingsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
