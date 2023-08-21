import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpRecordStopComponent } from './sp-record-stop.component';

describe('SpRecordStopComponent', () => {
  let component: SpRecordStopComponent;
  let fixture: ComponentFixture<SpRecordStopComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpRecordStopComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpRecordStopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
