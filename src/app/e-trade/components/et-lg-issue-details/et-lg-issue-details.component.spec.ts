import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtLgIssueDetailsComponent } from './et-lg-issue-details.component';

describe('EtLgIssueDetailsComponent', () => {
  let component: EtLgIssueDetailsComponent;
  let fixture: ComponentFixture<EtLgIssueDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtLgIssueDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtLgIssueDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
