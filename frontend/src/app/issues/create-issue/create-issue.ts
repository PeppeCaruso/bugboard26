import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { Location } from '@angular/common';
import { IssueService } from '../../core/services/issue.service';
import { MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-create-issue',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatDialogActions
  ],
  templateUrl: './create-issue.html',
  styleUrl: './create-issue.css',
})
export class CreateIssueComponent {
  createForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  selectedFileName = '';
  imagePreviewUrl = '';
  selectedFile: File | null = null;

  issueTypes = [
    { value: 'bug', label: 'Bug' },
    { value: 'question', label: 'Question' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'feature', label: 'Feature' },
  ];

  priorities = [
    { value: 'low', label: 'Bassa' },
    { value: 'medium', label: 'Media' },
    { value: 'high', label: 'Alta' },
  ];

  constructor(
    private fb: FormBuilder,
    private issueService: IssueService,
    private router: Router,
    private snackBar: MatSnackBar,
    private location: Location,
  ) {
    this.createForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      type: ['', Validators.required],
      priority: [''],
    });
  }

  onSubmit(): void {
    if (this.createForm.invalid) {
      this.createForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formData = new FormData();
    formData.append('title', this.createForm.value.title);
    formData.append('description', this.createForm.value.description);
    formData.append('type', this.createForm.value.type);
    if (this.createForm.value.priority) {
      formData.append('priority', this.createForm.value.priority);
    }
    if (this.selectedFile) {
      formData.append('image', this.selectedFile);
    }

    this.issueService.create(formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Issue creata con successo!', 'Chiudi', {
          duration: 3000,
          panelClass: 'snackbar-success',
        });
        this.router.navigate(['/issues']);
      },
      error: () => {
        this.isLoading = false;
        this.snackBar.open('Errore durante la creazione della issue', 'Chiudi', {
          duration: 3000,
          panelClass: 'snackbar-error',
        });
      },
    });
  }

  onCancel(): void {
    this.createForm.reset();
    this.selectedFileName = '';
    this.imagePreviewUrl = '';
    this.selectedFile = null;
  }

  //per il campo "immagine"
  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.selectedFile = file;
      this.selectedFileName = file.name;
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreviewUrl = e.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedFileName = '';
    this.imagePreviewUrl = '';
  }

  goBack(): void {
    this.location.back();
  }
}