import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuplanPage } from './usuplan.page';

describe('UsuplanPage', () => {
  let component: UsuplanPage;
  let fixture: ComponentFixture<UsuplanPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuplanPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
