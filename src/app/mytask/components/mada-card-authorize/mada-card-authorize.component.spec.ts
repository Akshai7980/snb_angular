import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MadaCardAuthorizeComponent } from './mada-card-authorize.component';

describe('MadaCardAuthorizeComponent', () => {
  let component: MadaCardAuthorizeComponent;
  let fixture: ComponentFixture<MadaCardAuthorizeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MadaCardAuthorizeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MadaCardAuthorizeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
