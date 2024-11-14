import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChofesperaPage } from './chofespera.page';

describe('ChofesperaPage', () => {
  let component: ChofesperaPage;
  let fixture: ComponentFixture<ChofesperaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ChofesperaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
