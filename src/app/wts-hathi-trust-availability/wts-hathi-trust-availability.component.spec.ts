import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsHathiTrustAvailabilityComponent } from './wts-hathi-trust-availability.component';

describe('WtsHathiTrustAvailabilityComponent', () => {
  let component: WtsHathiTrustAvailabilityComponent;
  let fixture: ComponentFixture<WtsHathiTrustAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsHathiTrustAvailabilityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsHathiTrustAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
