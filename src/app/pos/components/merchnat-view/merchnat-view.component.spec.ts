import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchnatViewComponent } from './merchnat-view.component';

describe('MerchnatViewComponent', () => {
  let component: MerchnatViewComponent;
  let fixture: ComponentFixture<MerchnatViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchnatViewComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchnatViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
