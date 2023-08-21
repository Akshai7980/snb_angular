import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadEsalComponent } from './sadad-esal.component';

describe('SadadEsalComponent', () => {
  let component: SadadEsalComponent;
  let fixture: ComponentFixture<SadadEsalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadEsalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadEsalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
