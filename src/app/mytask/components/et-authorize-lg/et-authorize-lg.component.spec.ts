import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtAuthorizeLgComponent } from './et-authorize-lg.component';

describe('EtAuthorizeLgComponent', () => {
  let component: EtAuthorizeLgComponent;
  let fixture: ComponentFixture<EtAuthorizeLgComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtAuthorizeLgComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtAuthorizeLgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
