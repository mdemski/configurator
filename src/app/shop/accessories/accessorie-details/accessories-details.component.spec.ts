import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AccessoriesDetailsComponent} from './accessories-details.component';

describe('AccessorieDetailsComponent', () => {
    let component: AccessoriesDetailsComponent;
    let fixture: ComponentFixture<AccessoriesDetailsComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AccessoriesDetailsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccessoriesDetailsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
