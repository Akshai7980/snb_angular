import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalAccountRequestComponent } from './additional-account-request.component';

describe('AdditionalAccountRequestComponent', () => {
  let component: AdditionalAccountRequestComponent;
  let fixture: ComponentFixture<AdditionalAccountRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalAccountRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalAccountRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
