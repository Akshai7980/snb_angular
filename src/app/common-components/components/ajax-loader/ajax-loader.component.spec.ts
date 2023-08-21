import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjaxLoaderComponent } from './ajax-loader.component';

describe('AjaxLoaderComponent', () => {
  let component: AjaxLoaderComponent;
  let fixture: ComponentFixture<AjaxLoaderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjaxLoaderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AjaxLoaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
