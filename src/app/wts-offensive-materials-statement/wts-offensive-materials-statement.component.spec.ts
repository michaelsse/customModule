import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WtsOffensiveMaterialsStatementComponent } from './wts-offensive-materials-statement.component';

describe('WtsOffensiveMaterialsStatementComponent', () => {
  let component: WtsOffensiveMaterialsStatementComponent;
  let fixture: ComponentFixture<WtsOffensiveMaterialsStatementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WtsOffensiveMaterialsStatementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WtsOffensiveMaterialsStatementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
