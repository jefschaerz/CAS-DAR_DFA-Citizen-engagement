import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListissuesComponent } from './listissues.component';

describe('ListissuesComponent', () => {
  let component: ListissuesComponent;
  let fixture: ComponentFixture<ListissuesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListissuesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListissuesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
