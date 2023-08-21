import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeSingleTransferComponent } from './authorize-single-transfer.component';

describe('AuthorizeSingleTransferComponent', () => {
  let component: AuthorizeSingleTransferComponent;
  let fixture: ComponentFixture<AuthorizeSingleTransferComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeSingleTransferComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeSingleTransferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
