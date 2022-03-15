import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AccessorieDetailsComponent} from './accessorie-details.component';

describe('AccessorieDetailsComponent', () => {
    let component: AccessorieDetailsComponent;
    let fixture: ComponentFixture<AccessorieDetailsComponent>;

    beforeEach(async(() => {
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
