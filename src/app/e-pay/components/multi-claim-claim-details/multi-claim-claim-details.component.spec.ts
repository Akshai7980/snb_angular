import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiClaimClaimDetailsComponent } from './multi-claim-claim-details.component';

describe('MultiClaimClaimDetailsComponent', () => {
  let component: MultiClaimClaimDetailsComponent;
  let fixture: ComponentFixture<MultiClaimClaimDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiClaimClaimDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiClaimClaimDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
