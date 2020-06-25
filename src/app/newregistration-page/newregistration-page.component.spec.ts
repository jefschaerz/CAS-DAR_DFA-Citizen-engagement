import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NewregistrationPageComponent } from './newregistration-page.component';

describe('NewregistrationPageComponent', () => {
  let component: NewregistrationPageComponent;
  let fixture: ComponentFixture<NewregistrationPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NewregistrationPageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NewregistrationPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
