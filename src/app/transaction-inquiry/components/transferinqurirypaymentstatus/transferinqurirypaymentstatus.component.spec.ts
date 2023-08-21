import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TransferinqurirypaymentstatusComponent } from './transferinqurirypaymentstatus.component';

describe('TransferinqurirypaymentstatusComponent', () => {
  let component: TransferinqurirypaymentstatusComponent;
  let fixture: ComponentFixture<TransferinqurirypaymentstatusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TransferinqurirypaymentstatusComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TransferinqurirypaymentstatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
