import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantFinaceDisputeComponent } from './merchant-finace-dispute.component';

describe('MerchantFinaceDisputeComponent', () => {
  let component: MerchantFinaceDisputeComponent;
  let fixture: ComponentFixture<MerchantFinaceDisputeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantFinaceDisputeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantFinaceDisputeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
