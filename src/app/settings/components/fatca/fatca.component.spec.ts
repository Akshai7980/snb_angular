import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FatcaComponent } from './fatca.component';

describe('FatcaComponent', () => {
  let component: FatcaComponent;
  let fixture: ComponentFixture<FatcaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FatcaComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FatcaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
