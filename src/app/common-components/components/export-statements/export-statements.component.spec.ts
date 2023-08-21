import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExportStatementsComponent } from './export-statements.component';

describe('ExportStatementsComponent', () => {
  let component: ExportStatementsComponent;
  let fixture: ComponentFixture<ExportStatementsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExportStatementsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExportStatementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
