import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RaisecomplaintstransferComponent } from './raisecomplaintstransfer.component';

describe('RaisecomplaintstransferComponent', () => {
  let component: RaisecomplaintstransferComponent;
  let fixture: ComponentFixture<RaisecomplaintstransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RaisecomplaintstransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RaisecomplaintstransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
