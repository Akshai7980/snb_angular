import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectEsalBillerComponent } from './reject-esal-biller.component';

describe('RejectEsalBillerComponent', () => {
  let component: RejectEsalBillerComponent;
  let fixture: ComponentFixture<RejectEsalBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectEsalBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectEsalBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
