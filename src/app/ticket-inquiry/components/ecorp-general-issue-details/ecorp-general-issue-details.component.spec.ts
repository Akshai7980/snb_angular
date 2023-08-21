import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcorpGeneralIssueDetailsComponent } from './ecorp-general-issue-details.component';

describe('EcorpGeneralIssueDetailsComponent', () => {
  let component: EcorpGeneralIssueDetailsComponent;
  let fixture: ComponentFixture<EcorpGeneralIssueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcorpGeneralIssueDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcorpGeneralIssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
