import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoofWindowDetailsComponent } from './roof-window-details.component';

describe('RoofWindowDetailsComponent', () => {
    let component: RoofWindowDetailsComponent;
    let fixture: ComponentFixture<RoofWindowDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoofWindowDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoofWindowDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});