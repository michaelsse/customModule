import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsPayFineLinkComponent } from './wts-pay-fine-link.component';

describe('WtsPayFineLinkComponent', () => {
  let component: WtsPayFineLinkComponent;
  let fixture: ComponentFixture<WtsPayFineLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsPayFineLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsPayFineLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
