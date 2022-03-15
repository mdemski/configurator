import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RegisterConfirmationPageComponent} from './register-confirmation-page.component';

describe('RegisterConfirmationPageComponent', () => {
    let component: RegisterConfirmationPageComponent;
    let fixture: ComponentFixture<RegisterConfirmationPageComponent>;

    beforeEach(async(() => {
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
