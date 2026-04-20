import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsNdeFooterComponent } from './wts-nde-footer.component';

describe('WtsNdeFooterComponent', () => {
  let component: WtsNdeFooterComponent;
  let fixture: ComponentFixture<WtsNdeFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsNdeFooterComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsNdeFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
