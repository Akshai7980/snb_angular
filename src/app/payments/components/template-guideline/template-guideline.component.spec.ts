import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateGuidelineComponent } from './template-guideline.component';

describe('TemplateGuidelineComponent', () => {
  let component: TemplateGuidelineComponent;
  let fixture: ComponentFixture<TemplateGuidelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TemplateGuidelineComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TemplateGuidelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
