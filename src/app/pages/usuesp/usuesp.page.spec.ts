import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuespPage } from './usuesp.page';

describe('UsuespPage', () => {
  let component: UsuespPage;
  let fixture: ComponentFixture<UsuespPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuespPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
