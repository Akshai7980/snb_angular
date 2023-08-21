import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBillerDetailsLayoutComponent } from './sadad-biller-details-layout.component';

describe('SadadBillerDetailsLayoutComponent', () => {
  let component: SadadBillerDetailsLayoutComponent;
  let fixture: ComponentFixture<SadadBillerDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBillerDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBillerDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
