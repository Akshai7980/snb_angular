import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtIssueLgComponent } from './et-issue-lg.component';

describe('EtIssueLgComponent', () => {
  let component: EtIssueLgComponent;
  let fixture: ComponentFixture<EtIssueLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtIssueLgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtIssueLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
