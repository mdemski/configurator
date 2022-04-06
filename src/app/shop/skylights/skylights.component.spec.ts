import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {SkylightsComponent} from './skylights.component';

describe('SkylightsComponent', () => {
    let component: SkylightsComponent;
    let fixture: ComponentFixture<SkylightsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SkylightsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SkylightsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
