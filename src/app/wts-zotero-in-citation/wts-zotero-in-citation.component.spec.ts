import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsZoteroInCitationComponent } from './wts-zotero-in-citation.component';

describe('WtsZoteroInCitationComponent', () => {
  let component: WtsZoteroInCitationComponent;
  let fixture: ComponentFixture<WtsZoteroInCitationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsZoteroInCitationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsZoteroInCitationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
