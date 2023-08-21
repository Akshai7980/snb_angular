import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteEsalBillerComponent } from './delete-esal-biller.component';

describe('DeleteEsalBillerComponent', () => {
  let component: DeleteEsalBillerComponent;
  let fixture: ComponentFixture<DeleteEsalBillerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeleteEsalBillerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DeleteEsalBillerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
