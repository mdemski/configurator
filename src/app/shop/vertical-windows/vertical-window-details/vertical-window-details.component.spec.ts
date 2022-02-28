import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VerticalWindowDetailsComponent} from './vertical-window-details.component';

describe('VerticalWindowDetailsComponent', () => {
    let component: VerticalWindowDetailsComponent;
    let fixture: ComponentFixture<VerticalWindowDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [VerticalWindowDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(VerticalWindowDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
