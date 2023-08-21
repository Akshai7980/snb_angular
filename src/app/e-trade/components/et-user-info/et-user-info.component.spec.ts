import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtUserInfoComponent } from './et-user-info.component';

describe('EtUserInfoComponent', () => {
  let component: EtUserInfoComponent;
  let fixture: ComponentFixture<EtUserInfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtUserInfoComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtUserInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
