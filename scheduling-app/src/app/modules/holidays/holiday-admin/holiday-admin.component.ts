import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { Router } from '@angular/router';
import { Holiday } from '../../calendar/types/holiday.interface';

@Component({
  selector: 'app-holiday-admin',
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
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
  ],
  templateUrl: './holiday-admin.component.html',
  styleUrls: ['./holiday-admin.component.scss'],
})
export class HolidayAdminComponent implements OnInit {
  holidayForm: FormGroup;
  isLoading = false;
  countries = [
    { code: 'US', name: 'United States' },
    { code: 'CA', name: 'Canada' },
    { code: 'GB', name: 'United Kingdom' },
  ];

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.holidayForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]],
      date: ['', Validators.required],
      country: ['', [Validators.required, Validators.pattern(/^[A-Z]{2}$/)]],
    });
  }

  ngOnInit(): void {
    this.apiService.getAllPTOs().subscribe({
      next: () => {},
      error: (err) => {
        if (err.status === 403) {
          this.snackBar.open('Admin access required', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/calendar']);
        } else if (err.status === 401) {
          localStorage.removeItem('auth_token');
          this.router.navigate(['/login']);
        }
      },
    });
  }

  onSubmit(): void {
    if (this.holidayForm.invalid) {
      this.holidayForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { name, date, country } = this.holidayForm.value;

    const selectedDate = new Date(date);
    const formattedDate = `${selectedDate.getFullYear()}-${(
      selectedDate.getMonth() + 1
    )
      .toString()
      .padStart(2, '0')}-${selectedDate.getDate().toString().padStart(2, '0')}`;

    this.apiService
      .addHoliday({ name, date: formattedDate, country })
      .subscribe({
        next: (holiday: Holiday) => {
          this.isLoading = false;
          this.holidayForm.reset();
          this.snackBar.open('Holiday added successfully', 'Close', {
            duration: 3000,
          });
        },
        error: (err) => {
          this.isLoading = false;
          this.snackBar.open('Failed to add holiday', 'Close', {
            duration: 3000,
          });
          if (err.status === 403) {
            this.snackBar.open('Admin access required', 'Close', {
              duration: 3000,
            });
            this.router.navigate(['/calendar']);
          } else if (err.status === 401) {
            localStorage.removeItem('auth_token');
            this.router.navigate(['/login']);
          }
        },
      });
  }
}
