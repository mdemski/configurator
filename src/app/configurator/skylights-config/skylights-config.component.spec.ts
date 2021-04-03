import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SkylightsConfigComponent } from './skylights-config.component';

describe('SkylightsConfigComponent', () => {
    let component: SkylightsConfigComponent;
    let fixture: ComponentFixture<SkylightsConfigComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SkylightsConfigComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(SkylightsConfigComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});