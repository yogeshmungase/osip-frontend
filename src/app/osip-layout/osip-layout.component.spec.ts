import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OsipLayoutComponent } from './osip-layout.component';

describe('OsipLayoutComponent', () => {
  let component: OsipLayoutComponent;
  let fixture: ComponentFixture<OsipLayoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [OsipLayoutComponent]
    });
    fixture = TestBed.createComponent(OsipLayoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
