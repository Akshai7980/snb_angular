import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedFiltercommonComponent } from './advanced-filtercommon.component';

describe('AdvancedFiltercommonComponent', () => {
  let component: AdvancedFiltercommonComponent;
  let fixture: ComponentFixture<AdvancedFiltercommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdvancedFiltercommonComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdvancedFiltercommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
