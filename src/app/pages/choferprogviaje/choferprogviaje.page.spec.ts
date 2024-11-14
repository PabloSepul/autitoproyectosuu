import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChoferprogviajePage } from './choferprogviaje.page';

describe('ChoferprogviajePage', () => {
  let component: ChoferprogviajePage;
  let fixture: ComponentFixture<ChoferprogviajePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoferprogviajePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
