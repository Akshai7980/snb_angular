import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpAccountDetailsComponent } from './sp-account-details.component';

describe('SpAccountDetailsComponent', () => {
  let component: SpAccountDetailsComponent;
  let fixture: ComponentFixture<SpAccountDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpAccountDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpAccountDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
