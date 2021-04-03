import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkylightsComponent } from './skylights.component';

describe('SkylightsComponent', () => {
    let component: SkylightsComponent;
    let fixture: ComponentFixture<SkylightsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SkylightsComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SkylightsComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});