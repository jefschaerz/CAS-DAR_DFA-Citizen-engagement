import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageissuecommentsComponent } from './manageissuecomments.component';

describe('ManageissuecommentsComponent', () => {
  let component: ManageissuecommentsComponent;
  let fixture: ComponentFixture<ManageissuecommentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageissuecommentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageissuecommentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
