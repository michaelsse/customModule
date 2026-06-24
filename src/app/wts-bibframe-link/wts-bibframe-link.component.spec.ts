import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsBibframeLinkComponent } from './wts-bibframe-link.component';

describe('WtsBibframeLinkComponent', () => {
  let component: WtsBibframeLinkComponent;
  let fixture: ComponentFixture<WtsBibframeLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsBibframeLinkComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsBibframeLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
