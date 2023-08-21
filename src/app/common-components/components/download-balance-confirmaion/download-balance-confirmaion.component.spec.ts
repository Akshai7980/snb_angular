import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DownloadBalanceConfirmaionComponent } from './download-balance-confirmaion.component';

describe('DownloadBalanceConfirmaionComponent', () => {
  let component: DownloadBalanceConfirmaionComponent;
  let fixture: ComponentFixture<DownloadBalanceConfirmaionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DownloadBalanceConfirmaionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DownloadBalanceConfirmaionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
