import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsWithdrawnTitleComponent } from './wts-withdrawn-title.component';

describe('WtsWithdrawnTitleComponent', () => {
  let component: WtsWithdrawnTitleComponent;
  let fixture: ComponentFixture<WtsWithdrawnTitleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsWithdrawnTitleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsWithdrawnTitleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
