import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsCustomNoResultsComponent } from './wts-custom-no-results.component';

describe('WtsCustomNoResultsComponent', () => {
  let component: WtsCustomNoResultsComponent;
  let fixture: ComponentFixture<WtsCustomNoResultsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsCustomNoResultsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsCustomNoResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
