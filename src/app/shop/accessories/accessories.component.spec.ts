import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AccessoriesComponent} from './accessories.component';

describe('AccessoriesComponent', () => {
    let component: AccessoriesComponent;
    let fixture: ComponentFixture<AccessoriesComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AccessoriesComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccessoriesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
