import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EtLgListComponent } from './et-lg-list.component';

describe('EtLgListComponent', () => {
  let component: EtLgListComponent;
  let fixture: ComponentFixture<EtLgListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EtLgListComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EtLgListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
