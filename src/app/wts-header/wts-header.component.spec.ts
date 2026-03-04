import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsHeaderComponent } from './wts-header.component';

describe('WtsHeaderComponent', () => {
  let component: WtsHeaderComponent;
  let fixture: ComponentFixture<WtsHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
