import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ConfigurationSummaryComponent} from './configuration-summary.component';

describe('ConfigurationSummaryComponent', () => {
    let component: ConfigurationSummaryComponent;
    let fixture: ComponentFixture<ConfigurationSummaryComponent>;

    beforeEach(waitForAsync(() => {
        TestBed.configureTestingModule({
            declarations: [ConfigurationSummaryComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ConfigurationSummaryComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
