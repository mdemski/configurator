import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RoofWindowFiltrationComponent } from './roof-window-filtration.component';

describe('RoofWindowFiltrationComponent', () => {
    let component: RoofWindowFiltrationComponent;
    let fixture: ComponentFixture<RoofWindowFiltrationComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [RoofWindowFiltrationComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(RoofWindowFiltrationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});