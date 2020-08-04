import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FilterissuesComponent } from './filterissues.component';

describe('FilterissuesComponent', () => {
  let component: FilterissuesComponent;
  let fixture: ComponentFixture<FilterissuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FilterissuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterissuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
