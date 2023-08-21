import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewMerchantDetailsComponent } from './new-merchant-details.component';

describe('NewMerchantDetailsComponent', () => {
  let component: NewMerchantDetailsComponent;
  let fixture: ComponentFixture<NewMerchantDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewMerchantDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NewMerchantDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
