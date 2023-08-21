import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkFileComponent } from './bulk-file.component';

describe('BulkFileComponent', () => {
  let component: BulkFileComponent;
  let fixture: ComponentFixture<BulkFileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulkFileComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BulkFileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
