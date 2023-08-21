import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrExpiryDetailsComponent } from './cr-expiry-details.component';

describe('CrExpiryDetailsComponent', () => {
  let component: CrExpiryDetailsComponent;
  let fixture: ComponentFixture<CrExpiryDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrExpiryDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrExpiryDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
