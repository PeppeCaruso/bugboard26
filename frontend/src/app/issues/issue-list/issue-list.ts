import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatChipsModule } from '@angular/material/chips';
import { Router, RouterModule } from '@angular/router';
import { IssueService, IssueStats, Issue } from '../../core/services/issue.service';
import { CommonModule } from '@angular/common';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog';
import { FilterDialogComponent } from '../../shared/filter-dialog/filter-dialog';
import { AuthService, User } from '../../core/services/auth.service';


@Component({
  selector: 'app-issue-list',
  imports: [ RouterModule, CommonModule, MatCardModule, MatIcon, MatTableModule, MatTooltipModule, MatChipsModule ],
  templateUrl: './issue-list.html',
  styleUrl: './issue-list.css',
})
export class IssueListComponent implements OnInit {
  currentUser: User | null = null;
  issues: Issue[] = [];
  displayedColumns = ['type', 'title', 'status', 'priority', 'author', 'assignee', 'createdAt', 'actions'];

  //filtri
  filterTypes: string[] = [];
  filterStatuses: string[] = [];
  filterPriorities: string[] = [];
  dateFrom: Date | null = null;
  dateTo: Date | null = null;

  typeOptions = ['bug', 'feature', 'question', 'documentation'];
  statusOptions = ['todo', 'in_progress', 'done'];
  priorityOptions = ['low', 'medium', 'high'];

  constructor(
    private authService: AuthService,
    private issueService: IssueService,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (user) => (this.currentUser = user),
    });
    this.loadIssues();
  }

  loadIssues(): void {
    this.issueService.findAll().subscribe({
      next: (issues) => (this.issues = issues),
    });
  }

  deleteIssue(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: { message: 'Sei sicuro di voler eliminare questa issue?' }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.issueService.delete(id).subscribe({
          next: () => {
            this.loadIssues();
            this.snackBar.open('Issue eliminata con successo', 'Chiudi', {
              duration: 3000,
              panelClass: 'snackbar-success',
            });
          },
          error: () => {
            this.snackBar.open('Errore durante l\'eliminazione', 'Chiudi', {
              duration: 3000,
              panelClass: 'snackbar-error',
            });
          }
        });
      }
    });
  }

  // metodi per gestire i filtri
  toggleFilter(value: string, filterArray: string[]): void {
    const index = filterArray.indexOf(value);
    if (index >= 0) {
      filterArray.splice(index, 1);
    } else {
      filterArray.push(value);
    }
    this.applyFilters();
  }

  applyFilters(): void {
    this.issueService.findAll({
      type: this.filterTypes.join(','),
      status: this.filterStatuses.join(','),
      priority: this.filterPriorities.join(','),
      dateFrom: this.dateFrom?.toISOString(),
      dateTo: this.dateTo?.toISOString(),
    }).subscribe({
      next: (issues) => (this.issues = issues),
    });
  }

  isSelected(value: string, filterArray: string[]): boolean {
    return filterArray.includes(value);
  }

  // aggiungi il metodo
  openFilters(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent, {
      width: '400px',
      data: {
        filterTypes: this.filterTypes,
        filterStatuses: this.filterStatuses,
        filterPriorities: this.filterPriorities,
        dateFrom: this.dateFrom,
        dateTo: this.dateTo,
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result !== undefined) {
        this.filterTypes = result?.filterTypes ?? [];
        this.filterStatuses = result?.filterStatuses ?? [];
        this.filterPriorities = result?.filterPriorities ?? [];
        this.dateFrom = result?.dateFrom ? new Date(result.dateFrom) : null;
        this.dateTo = result?.dateTo ? new Date(result.dateTo) : null;
        this.applyFilters();
      }
    });
  }

  get activeFiltersCount(): number {
    return this.filterTypes.length + 
          this.filterStatuses.length + 
          this.filterPriorities.length + 
          (this.dateFrom || this.dateTo ? 1 : 0);
  }

  //Archiviazione issues
  archiveIssue(id: number): void {
    this.issueService.archive(id).subscribe({
      next: () => {
        this.loadIssues();
        this.snackBar.open('Issue archiviata con successo', 'Chiudi', {
          duration: 3000,
          panelClass: 'snackbar-success',
        });
      },
      error: () => {
        this.snackBar.open('Errore durante l\'archiviazione', 'Chiudi', {
          duration: 3000,
          panelClass: 'snackbar-error',
        });
      }
    });
  }
}
