import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YesNoLabelComponent } from './yes-no-label.component';

describe('YesNoLabelComponent', () => {
  let component: YesNoLabelComponent;
  let fixture: ComponentFixture<YesNoLabelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YesNoLabelComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YesNoLabelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
