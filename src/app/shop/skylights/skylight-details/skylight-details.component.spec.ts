import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {SkylightDetailsComponent} from './skylight-details.component';

describe('SkylightDetailsComponent', () => {
    let component: SkylightDetailsComponent;
    let fixture: ComponentFixture<SkylightDetailsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [SkylightDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SkylightDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
