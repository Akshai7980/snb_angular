import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReissueMadaCardComponent } from './reissue-mada-card.component';

describe('ReissueMadaCardComponent', () => {
  let component: ReissueMadaCardComponent;
  let fixture: ComponentFixture<ReissueMadaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ReissueMadaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReissueMadaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
