import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AccessorieDetailsComponent} from './accessorie-details.component';

describe('AccessorieDetailsComponent', () => {
    let component: AccessorieDetailsComponent;
    let fixture: ComponentFixture<AccessorieDetailsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AccessorieDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccessorieDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
