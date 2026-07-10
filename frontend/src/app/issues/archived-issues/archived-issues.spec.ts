import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArchivedIssues } from './archived-issues';

describe('ArchivedIssues', () => {
  let component: ArchivedIssues;
  let fixture: ComponentFixture<ArchivedIssues>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ArchivedIssues],
    }).compileComponents();

    fixture = TestBed.createComponent(ArchivedIssues);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
