import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {FlashingsConfigComponent} from './flashings-config.component';

describe('FlashingsConfigComponent', () => {
    let component: FlashingsConfigComponent;
    let fixture: ComponentFixture<FlashingsConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [FlashingsConfigComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlashingsConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
