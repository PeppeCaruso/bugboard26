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
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDividerModule } from '@angular/material/divider';
import { UserService } from '../../core/services/user.service';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogActions } from '@angular/material/dialog';

@Component({
  selector: 'app-create-user',
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
    MatSnackBarModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDialogActions,
  ],
  templateUrl: './create-user.html',
  styleUrl: './create-user.css',
})
export class CreateUserComponent {
  createUserForm: FormGroup;
  isLoading = false;
  errorMessage = '';
  hidePassword = true;

  roles = [
    { value: 'user', label: 'Utente' },
    { value: 'admin', label: 'Amministratore' },
  ];

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) {
    this.createUserForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      role: ['user', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.createUserForm.invalid) {
      this.createUserForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    const formValue = {
      firstName: this.createUserForm.value.firstName,
      lastName: this.createUserForm.value.lastName,
      email: this.createUserForm.value.email,
      password: this.createUserForm.value.password,
      role: this.createUserForm.value.isAdmin ? 'admin' : 'user',
    };

    this.userService.create(this.createUserForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        this.snackBar.open('Utente creato con successo!', 'Chiudi', {
          duration: 3000,
          panelClass: 'snackbar-success',
        });
        this.router.navigate(['/dashboard']);
      },
      error: (err) => {
        this.isLoading = false;
        this.errorMessage = err.status === 409
          ? 'Email già in uso'
          : 'Errore durante la creazione dell\'utente';
        this.snackBar.open(this.errorMessage, 'Chiudi', {
          duration: 3000,
          panelClass: 'snackbar-error',
        });
      },
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  onCancel(): void {
    this.createUserForm.reset();
    this.createUserForm.patchValue({ role: 'user' });
  }
}