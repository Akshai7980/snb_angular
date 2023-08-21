import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadComponent } from './sadad.component';

describe('SadadComponent', () => {
  let component: SadadComponent;
  let fixture: ComponentFixture<SadadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
