import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsCustomLibraryResourcesComponent } from './wts-custom-library-resources.component';

describe('WtsCustomLibraryResourcesComponent', () => {
  let component: WtsCustomLibraryResourcesComponent;
  let fixture: ComponentFixture<WtsCustomLibraryResourcesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsCustomLibraryResourcesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsCustomLibraryResourcesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
