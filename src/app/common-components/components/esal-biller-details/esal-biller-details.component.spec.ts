import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalBillerDetailsComponent } from './esal-biller-details.component';

describe('EsalBillerDetailsComponent', () => {
  let component: EsalBillerDetailsComponent;
  let fixture: ComponentFixture<EsalBillerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsalBillerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsalBillerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
