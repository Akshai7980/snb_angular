import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpStopFileComponent } from './sp-stop-file.component';

describe('SpStopFileComponent', () => {
  let component: SpStopFileComponent;
  let fixture: ComponentFixture<SpStopFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpStopFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpStopFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
