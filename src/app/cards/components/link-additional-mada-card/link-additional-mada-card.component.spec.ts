import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkAdditionalMadaCardComponent } from './link-additional-mada-card.component';

describe('LinkAdditionalMadaCardComponent', () => {
  let component: LinkAdditionalMadaCardComponent;
  let fixture: ComponentFixture<LinkAdditionalMadaCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LinkAdditionalMadaCardComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LinkAdditionalMadaCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
