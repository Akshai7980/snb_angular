import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchnatEditComponent } from './merchnat-edit.component';

describe('MerchnatEditComponent', () => {
  let component: MerchnatEditComponent;
  let fixture: ComponentFixture<MerchnatEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MerchnatEditComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MerchnatEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
