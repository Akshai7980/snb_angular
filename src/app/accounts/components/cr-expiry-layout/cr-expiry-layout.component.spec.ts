import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrExpiryLayoutComponent } from './cr-expiry-layout.component';

describe('CrExpiryLayoutComponent', () => {
  let component: CrExpiryLayoutComponent;
  let fixture: ComponentFixture<CrExpiryLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CrExpiryLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrExpiryLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
