import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsCustomCollectionDiscoveryComponent } from './wts-custom-collection-discovery.component';

describe('WtsCustomCollectionDiscoveryComponent', () => {
  let component: WtsCustomCollectionDiscoveryComponent;
  let fixture: ComponentFixture<WtsCustomCollectionDiscoveryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsCustomCollectionDiscoveryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsCustomCollectionDiscoveryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
