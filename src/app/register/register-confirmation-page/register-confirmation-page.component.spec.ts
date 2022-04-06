import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {RegisterConfirmationPageComponent} from './register-confirmation-page.component';

describe('RegisterConfirmationPageComponent', () => {
    let component: RegisterConfirmationPageComponent;
    let fixture: ComponentFixture<RegisterConfirmationPageComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RegisterConfirmationPageComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RegisterConfirmationPageComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
