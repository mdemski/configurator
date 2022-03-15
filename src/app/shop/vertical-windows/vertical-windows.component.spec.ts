import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VerticalWindowsComponent} from './vertical-windows.component';

describe('VerticalWindowsComponent', () => {
    let component: VerticalWindowsComponent;
    let fixture: ComponentFixture<VerticalWindowsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VerticalWindowsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VerticalWindowsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
