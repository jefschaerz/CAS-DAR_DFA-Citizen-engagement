import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewregistrationformComponent } from './newregistrationform.component';

describe('NewregistrationformComponent', () => {
  let component: NewregistrationformComponent;
  let fixture: ComponentFixture<NewregistrationformComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewregistrationformComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewregistrationformComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
