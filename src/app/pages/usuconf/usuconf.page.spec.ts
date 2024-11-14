import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UsuconfPage } from './usuconf.page';

describe('UsuconfPage', () => {
  let component: UsuconfPage;
  let fixture: ComponentFixture<UsuconfPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuconfPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
