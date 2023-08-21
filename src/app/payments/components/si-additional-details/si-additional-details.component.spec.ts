import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiAdditionalDetailsComponent } from './si-additional-details.component';

describe('SiAdditionalDetailsComponent', () => {
  let component: SiAdditionalDetailsComponent;
  let fixture: ComponentFixture<SiAdditionalDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiAdditionalDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiAdditionalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
