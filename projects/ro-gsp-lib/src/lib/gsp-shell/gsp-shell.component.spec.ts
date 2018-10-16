import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GspShellComponent } from './gsp-shell.component';

describe('GspShellComponent', () => {
  let component: GspShellComponent;
  let fixture: ComponentFixture<GspShellComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GspShellComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GspShellComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
