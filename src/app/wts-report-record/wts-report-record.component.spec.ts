import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PnxTestComponent } from './pnx-test.component';

describe('PnxTestComponent', () => {
  let component: PnxTestComponent;
  let fixture: ComponentFixture<PnxTestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PnxTestComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PnxTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
