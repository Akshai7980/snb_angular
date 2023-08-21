import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalBillerComponent } from './esal-biller.component';

describe('EsalBillerComponent', () => {
  let component: EsalBillerComponent;
  let fixture: ComponentFixture<EsalBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsalBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsalBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
