import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EcorpGeneralIssueComponent } from './ecorp-general-issue.component';

describe('EcorpGeneralIssueComponent', () => {
  let component: EcorpGeneralIssueComponent;
  let fixture: ComponentFixture<EcorpGeneralIssueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EcorpGeneralIssueComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EcorpGeneralIssueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
