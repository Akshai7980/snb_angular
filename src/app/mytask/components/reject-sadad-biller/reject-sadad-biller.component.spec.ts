import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectSadadBillerComponent } from './reject-sadad-biller.component';

describe('RejectSadadBillerComponent', () => {
  let component: RejectSadadBillerComponent;
  let fixture: ComponentFixture<RejectSadadBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectSadadBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectSadadBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
