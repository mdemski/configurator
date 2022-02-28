import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlashingDetailsComponent} from './flashing-details.component';

describe('FlashingDetailsComponent', () => {
    let component: FlashingDetailsComponent;
    let fixture: ComponentFixture<FlashingDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FlashingDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlashingDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
