import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostransactionDetailsComponent } from './postransaction-details.component';

describe('PostransactionDetailsComponent', () => {
  let component: PostransactionDetailsComponent;
  let fixture: ComponentFixture<PostransactionDetailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PostransactionDetailsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PostransactionDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
