import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadBillerDetailsComponent } from './sadad-biller-details.component';

describe('SadadBillerDetailsComponent', () => {
  let component: SadadBillerDetailsComponent;
  let fixture: ComponentFixture<SadadBillerDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadBillerDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadBillerDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
