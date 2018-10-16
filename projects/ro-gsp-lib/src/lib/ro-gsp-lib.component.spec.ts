import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RogspLibComponent } from './ro-gsp-lib.component';

describe('RogspLibComponent', () => {
  let component: RogspLibComponent;
  let fixture: ComponentFixture<RogspLibComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RogspLibComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RogspLibComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
