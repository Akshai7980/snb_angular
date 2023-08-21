import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalAccountFormComponent } from './additional-account-form.component';

describe('AdditionalAccountFormComponent', () => {
  let component: AdditionalAccountFormComponent;
  let fixture: ComponentFixture<AdditionalAccountFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalAccountFormComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalAccountFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
