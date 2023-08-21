import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EsalBillerDetailsLayoutComponent } from './esal-biller-details-layout.component';

describe('EsalBillerDetailsLayoutComponent', () => {
  let component: EsalBillerDetailsLayoutComponent;
  let fixture: ComponentFixture<EsalBillerDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EsalBillerDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EsalBillerDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
