import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtAmendLgComponent } from './et-amend-lg.component';

describe('EtAmendLgComponent', () => {
  let component: EtAmendLgComponent;
  let fixture: ComponentFixture<EtAmendLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtAmendLgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtAmendLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
