import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {VerticalWindowsConfigComponent} from './vertical-windows-config.component';

describe('VerticalWindowsConfigComponent', () => {
    let component: VerticalWindowsConfigComponent;
    let fixture: ComponentFixture<VerticalWindowsConfigComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [VerticalWindowsConfigComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VerticalWindowsConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
