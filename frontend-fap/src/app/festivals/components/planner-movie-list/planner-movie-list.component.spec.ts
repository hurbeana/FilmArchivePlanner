import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlannerMovieListComponent } from './planner-movie-list.component';

describe('PlannerMovieListComponent', () => {
  let component: PlannerMovieListComponent;
  let fixture: ComponentFixture<PlannerMovieListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PlannerMovieListComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlannerMovieListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
