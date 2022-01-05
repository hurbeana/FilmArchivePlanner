import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdvancedSearchViewComponent } from './advanced-search-view.component';

describe('AdvancedSearchViewComponent', () => {
  let component: AdvancedSearchViewComponent;
  let fixture: ComponentFixture<AdvancedSearchViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AdvancedSearchViewComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdvancedSearchViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
