import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {AccessoriesConfigComponent} from './accessories-config.component';

describe('AccessoriesConfigComponent', () => {
    let component: AccessoriesConfigComponent;
    let fixture: ComponentFixture<AccessoriesConfigComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [AccessoriesConfigComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(AccessoriesConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
