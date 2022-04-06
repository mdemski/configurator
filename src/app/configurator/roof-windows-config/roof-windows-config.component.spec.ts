import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {RoofWindowsConfigComponent} from './roof-windows-config.component';

describe('RoofWindowsConfigComponent', () => {
    let component: RoofWindowsConfigComponent;
    let fixture: ComponentFixture<RoofWindowsConfigComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [RoofWindowsConfigComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoofWindowsConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
