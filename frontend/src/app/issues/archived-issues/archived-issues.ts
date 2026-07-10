import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { IssueService, Issue } from '../../core/services/issue.service';

@Component({
  selector: 'app-archived-issues',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTableModule,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './archived-issues.html',
  styleUrl: './archived-issues.css',
})
export class ArchivedIssuesComponent implements OnInit {
  issues: Issue[] = [];
  displayedColumns = ['type', 'title', 'status', 'priority', 'author', 'assignee', 'createdAt', 'actions'];

  constructor(
    private issueService: IssueService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.loadArchivedIssues();
  }

  loadArchivedIssues(): void {
    this.issueService.findArchived().subscribe({
      next: (issues) => (this.issues = issues),
    });
  }

  unarchiveIssue(id: number): void {
    this.issueService.unarchive(id).subscribe({
      next: () => {
        this.loadArchivedIssues();
        this.snackBar.open('Issue disarchiviata con successo', 'Chiudi', {
          duration: 3000,
          panelClass: 'snackbar-success',
        });
      },
      error: () => {
        this.snackBar.open('Errore durante la disarchiviazione', 'Chiudi', {
          duration: 3000,
          panelClass: 'snackbar-error',
        });
      }
    });
  }
}