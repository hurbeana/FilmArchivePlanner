import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FullDetailViewComponent } from './full-detail-view.component';

describe('FullDetailViewComponent', () => {
  let component: FullDetailViewComponent;
  let fixture: ComponentFixture<FullDetailViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FullDetailViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FullDetailViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
