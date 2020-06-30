import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DebuggingPageComponent as DebugginPageComponent } from './debugging-page.component';

describe('DebuggingPageComponent', () => {
  let component: DebugginPageComponent;
  let fixture: ComponentFixture<DebugginPageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DebugginPageComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DebugginPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
