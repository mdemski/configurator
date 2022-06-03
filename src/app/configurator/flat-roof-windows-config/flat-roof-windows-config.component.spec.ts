import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {FlatRoofWindowsConfigComponent} from './flat-roof-windows-config.component';

describe('FlatRoofWindowsConfigComponent', () => {
    let component: FlatRoofWindowsConfigComponent;
    let fixture: ComponentFixture<FlatRoofWindowsConfigComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [FlatRoofWindowsConfigComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(FlatRoofWindowsConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});