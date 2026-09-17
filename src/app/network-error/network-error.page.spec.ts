import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NetworkErrorPage } from './network-error.page';

describe('NetworkErrorPage', () => {
  let component: NetworkErrorPage;
  let fixture: ComponentFixture<NetworkErrorPage>;

  beforeEach(async () => {
    fixture = TestBed.createComponent(NetworkErrorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
