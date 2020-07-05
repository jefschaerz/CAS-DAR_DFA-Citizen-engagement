import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageissueComponent } from './manageissue.component';

describe('ManageissueComponent', () => {
  let component: ManageissueComponent;
  let fixture: ComponentFixture<ManageissueComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ManageissueComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageissueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
