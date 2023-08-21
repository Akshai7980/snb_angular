import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RejectQtlComponent } from './reject-qtl.component';

describe('RejectQtlComponent', () => {
  let component: RejectQtlComponent;
  let fixture: ComponentFixture<RejectQtlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RejectQtlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RejectQtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
