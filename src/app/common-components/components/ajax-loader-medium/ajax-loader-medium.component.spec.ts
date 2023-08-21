import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjaxLoaderMediumComponent } from './ajax-loader-medium.component';

describe('AjaxLoaderMediumComponent', () => {
  let component: AjaxLoaderMediumComponent;
  let fixture: ComponentFixture<AjaxLoaderMediumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjaxLoaderMediumComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjaxLoaderMediumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
