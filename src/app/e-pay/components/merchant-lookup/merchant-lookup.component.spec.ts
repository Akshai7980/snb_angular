import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantLookupComponent } from './merchant-lookup.component';

describe('MerchantLookupComponent', () => {
  let component: MerchantLookupComponent;
  let fixture: ComponentFixture<MerchantLookupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchantLookupComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchantLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
