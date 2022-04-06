import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {RoofWindowsComponent} from './roof-windows.component';

describe('RoofWindowsComponent', () => {
    let component: RoofWindowsComponent;
    let fixture: ComponentFixture<RoofWindowsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RoofWindowsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoofWindowsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
