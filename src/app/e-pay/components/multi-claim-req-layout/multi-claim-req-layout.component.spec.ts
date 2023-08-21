import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultiClaimReqLayoutComponent } from './multi-claim-req-layout.component';

describe('MultiClaimReqLayoutComponent', () => {
  let component: MultiClaimReqLayoutComponent;
  let fixture: ComponentFixture<MultiClaimReqLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MultiClaimReqLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MultiClaimReqLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
