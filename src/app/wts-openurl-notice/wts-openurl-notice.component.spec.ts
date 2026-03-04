import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsOpenurlNoticeComponent } from './wts-openurl-notice.component';

describe('WtsOpenurlNoticeComponent', () => {
  let component: WtsOpenurlNoticeComponent;
  let fixture: ComponentFixture<WtsOpenurlNoticeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsOpenurlNoticeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsOpenurlNoticeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
