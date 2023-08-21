import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadDetailsComponent } from './sadad-details.component';

describe('SadadDetailsComponent', () => {
  let component: SadadDetailsComponent;
  let fixture: ComponentFixture<SadadDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
