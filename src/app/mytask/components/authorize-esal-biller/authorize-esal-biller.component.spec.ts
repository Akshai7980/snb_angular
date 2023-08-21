import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeEsalBillerComponent } from './authorize-esal-biller.component';

describe('AuthorizeEsalBillerComponent', () => {
  let component: AuthorizeEsalBillerComponent;
  let fixture: ComponentFixture<AuthorizeEsalBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeEsalBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeEsalBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
