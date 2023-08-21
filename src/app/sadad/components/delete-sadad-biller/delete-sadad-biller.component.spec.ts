import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteSadadBillerComponent } from './delete-sadad-biller.component';

describe('DeleteSadadBillerComponent', () => {
  let component: DeleteSadadBillerComponent;
  let fixture: ComponentFixture<DeleteSadadBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteSadadBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteSadadBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
