import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalRequestComponent } from './additional-request.component';

describe('AdditionalRequestComponent', () => {
  let component: AdditionalRequestComponent;
  let fixture: ComponentFixture<AdditionalRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdditionalRequestComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionalRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
