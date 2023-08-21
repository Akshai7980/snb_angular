import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SadadDetailsLayoutComponent } from './sadad-details-layout.component';

describe('SadadDetailsLayoutComponent', () => {
  let component: SadadDetailsLayoutComponent;
  let fixture: ComponentFixture<SadadDetailsLayoutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SadadDetailsLayoutComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SadadDetailsLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
