import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanEditorComponent } from './plan-editor.component';

describe('PlanEditorComponent', () => {
  let component: PlanEditorComponent;
  let fixture: ComponentFixture<PlanEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlanEditorComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
