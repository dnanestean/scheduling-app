import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ApiService } from '../../core/services/api.service';
import { User } from './types/user.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  user: User | null = null;
  isEditing = false;
  profileForm: FormGroup;
  loading = true;

  constructor(
    private authService: AuthService,
    private apiService: ApiService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      country: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.authService.getCurrentUser().subscribe({
      next: (user: User | null) => {
        if (user) {
          this.user = {
            id: user.id,
            username: user.username,
            role: user.role,
            name: user.name || '',
            country: user.country || '',
          };
          this.profileForm.patchValue({
            name: this.user.name,
            country: this.user.country,
          });
        } else {
          this.snackBar.open('User data not available', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/login']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.loading = false;
        this.snackBar.open('Failed to load profile', 'Close', {
          duration: 3000,
        });
        console.error('Profile error:', err);
        if (err.status === 401) {
          this.authService.logout();
          this.router.navigate(['/login']);
        }
      },
    });
  }

  toggleEdit(): void {
    this.isEditing = !this.isEditing;
    if (!this.isEditing && this.user) {
      this.profileForm.patchValue({
        name: this.user.name,
        country: this.user.country,
      });
    }
  }

  saveProfile(): void {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    const { name, country } = this.profileForm.value;

    this.apiService.updateUserProfile({ name, country }).subscribe({
      next: (updatedUser: User) => {
        this.user = updatedUser;
        this.isEditing = false;
        this.snackBar.open('Profile updated successfully', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to update profile', 'Close', {
          duration: 3000,
        });
        console.error('Update profile error:', err);
      },
    });
  }
}
