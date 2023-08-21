import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtLgDetailsComponent } from './et-lg-details.component';

describe('EtLgDetailsComponent', () => {
  let component: EtLgDetailsComponent;
  let fixture: ComponentFixture<EtLgDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtLgDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtLgDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
