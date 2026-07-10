import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { IssueService, Issue } from '../../core/services/issue.service';
import { AuthService } from '../../core/services/auth.service';
import { CommentService, Comment } from '../../core/services/comment.service';
import { UserService, User } from '../../core/services/user.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-issue-detail',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatSnackBarModule,
    MatSelectModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatDividerModule,
  ],
  templateUrl: './issue-detail.html',
  styleUrl: './issue-detail.css',
})
export class IssueDetailComponent implements OnInit {
  issue: Issue | null = null;
  currentUser: User | null = null;
  users: User[] = [];
  comments: Comment[] = [];
  newComment = '';

  statusOptions = [
    { value: 'todo', label: 'Todo' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'done', label: 'Done' },
  ];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private issueService: IssueService,
    private authService: AuthService,
    private commentService: CommentService,
    private snackBar: MatSnackBar,
    private userService: UserService,
    private location: Location,
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadIssue(+id);
    }

    this.authService.getMe().subscribe({
      next: (user) => (this.currentUser = user),
    });

    this.userService.findAll().subscribe({
      next: (users) => (this.users = users),
    });
  }

  loadIssue(id: number): void {
    this.issueService.findOne(id).subscribe({
      next: (issue) => {
        this.issue = issue;
        this.comments = issue.comments || [];
      },
    });
  }

  getInitials(firstName: string, lastName: string): string {
    return (firstName.charAt(0) + lastName.charAt(0)).toUpperCase();
  }

  updateStatus(status: string): void {
    if (!this.issue) return;
    this.issueService.updateStatus(this.issue.id, status).subscribe({
      next: (updated) => {
        this.issue = updated;
        this.snackBar.open('Stato aggiornato', 'Chiudi', { duration: 3000 });
      },
    });
  }

  addComment(): void {
    if (!this.newComment.trim() || !this.issue) return;
    this.commentService.create(this.issue.id, this.newComment).subscribe({
      next: (comment) => {
        this.comments.push(comment);
        this.newComment = '';
        this.snackBar.open('Commento aggiunto', 'Chiudi', { duration: 3000 });
      },
    });
  }

  archiveIssue(): void {
    if (!this.issue) return;
    this.issueService.archive(this.issue.id).subscribe({
      next: () => {
        this.snackBar.open('Issue archiviata', 'Chiudi', { duration: 3000, panelClass: 'snackbar-success' });
        this.router.navigate(['/issues']);
      },
    });
  }

  goBack(): void {
    this.location.back();
  }

  assignIssue(assigneeId: number | null): void {
    if (!this.issue) return;
    this.issueService.assign(this.issue.id, assigneeId).subscribe({
      next: (updated) => {
        this.issue = updated;
        this.snackBar.open('Issue assegnata', 'Chiudi', { duration: 3000 });
      },
    });
  }
}