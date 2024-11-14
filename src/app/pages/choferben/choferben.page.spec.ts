import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChoferbenPage } from './choferben.page';

describe('ChoferbenPage', () => {
  let component: ChoferbenPage;
  let fixture: ComponentFixture<ChoferbenPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChoferbenPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
