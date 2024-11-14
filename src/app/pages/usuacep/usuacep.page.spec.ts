import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuacepPage } from './usuacep.page';

describe('UsuacepPage', () => {
  let component: UsuacepPage;
  let fixture: ComponentFixture<UsuacepPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuacepPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
