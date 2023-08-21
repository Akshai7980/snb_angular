import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SummaryToolsComponent } from './summary-tools.component';

describe('SummaryToolsComponent', () => {
  let component: SummaryToolsComponent;
  let fixture: ComponentFixture<SummaryToolsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SummaryToolsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SummaryToolsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
