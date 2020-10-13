import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { IssuetypesComponent } from './issuetypes.component';

describe('IssuetypesComponent', () => {
  let component: IssuetypesComponent;
  let fixture: ComponentFixture<IssuetypesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IssuetypesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IssuetypesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
