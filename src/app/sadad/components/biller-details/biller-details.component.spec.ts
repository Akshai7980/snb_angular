import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BillerDetailsComponent } from './biller-details.component';

describe('BillerDetailsComponent', () => {
  let component: BillerDetailsComponent;
  let fixture: ComponentFixture<BillerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BillerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BillerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
