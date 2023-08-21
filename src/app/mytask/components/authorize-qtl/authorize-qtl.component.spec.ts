import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthorizeQtlComponent } from './authorize-qtl.component';

describe('AuthorizeQtlComponent', () => {
  let component: AuthorizeQtlComponent;
  let fixture: ComponentFixture<AuthorizeQtlComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthorizeQtlComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthorizeQtlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
