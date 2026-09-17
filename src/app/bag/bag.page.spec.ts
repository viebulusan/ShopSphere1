import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BagPage } from './bag.page';

describe('BagPage', () => {
  let component: BagPage;
  let fixture: ComponentFixture<BagPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(BagPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
