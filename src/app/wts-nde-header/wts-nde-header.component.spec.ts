import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsNdeHeaderComponent } from './wts-nde-header.component';

describe('WtsNdeHeaderComponent', () => {
  let component: WtsNdeHeaderComponent;
  let fixture: ComponentFixture<WtsNdeHeaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsNdeHeaderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsNdeHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
