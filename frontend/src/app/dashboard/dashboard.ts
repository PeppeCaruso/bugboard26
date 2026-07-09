import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService, User } from '../core/services/auth.service';
import { IssueService, IssueStats, Issue } from '../core/services/issue.service';

@Component({
  selector: 'app-dashboard', 
  imports: [ RouterModule, CommonModule, MatCardModule, MatIcon, MatTableModule ],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class DashboardComponent implements OnInit {
currentUser: User | null = null;
stats: IssueStats = { todo: 0, inProgress: 0, done: 0 };
assignedIssues: Issue[] = [];
displayedColumns = ['type', 'title', 'status', 'author', 'createdAt', 'actions'];

constructor(
    private issueService: IssueService,
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (user) => (this.currentUser = user),
      error: () => (this.currentUser = null),
    });

    this.issueService.getStats().subscribe({
      next: (stats) => (this.stats = stats),
    });

    this.issueService.findAssignedToMe().subscribe({
      next: (issues) => (this.assignedIssues = issues),
    });
  }

}