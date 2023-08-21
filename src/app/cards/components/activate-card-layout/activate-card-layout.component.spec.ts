import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ActivateCardLayoutComponent } from './activate-card-layout.component';

describe('ActivateCardLayoutComponent', () => {
  let component: ActivateCardLayoutComponent;
  let fixture: ComponentFixture<ActivateCardLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ActivateCardLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ActivateCardLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
