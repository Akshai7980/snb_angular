import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtCompanyInfoComponent } from './et-company-info.component';

describe('EtCompanyInfoComponent', () => {
  let component: EtCompanyInfoComponent;
  let fixture: ComponentFixture<EtCompanyInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtCompanyInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtCompanyInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
