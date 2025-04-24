import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../../core/services/api.service';
import { PTO } from '../types/pto.interface';
import { Router } from '@angular/router';
import { UtcDatePipe } from '../../../core/pipes/utcdatepipe';

@Component({
  selector: 'app-pto-request',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatCardModule,
    UtcDatePipe,
  ],
  templateUrl: './pto-request.component.html',
  styleUrls: ['./pto-request.component.scss'],
})
export class PTORequestComponent implements OnInit {
  ptoForm: FormGroup;
  ptos: PTO[] = [];
  displayedColumns: string[] = [
    'startDate',
    'endDate',
    'reason',
    'status',
    'actions',
  ];
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.ptoForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      reason: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  ngOnInit(): void {
    this.loadPTOs();
  }

  loadPTOs(): void {
    this.apiService.getUserPTOs().subscribe({
      next: (ptos) => {
        this.ptos = ptos;
        console.log('Loaded PTOs:', ptos);
      },
      error: (err) => {
        this.snackBar.open('Failed to load PTO requests', 'Close', {
          duration: 3000,
        });
        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      },
    });
  }

  onSubmit(): void {
    if (this.ptoForm.invalid) {
      this.ptoForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const { startDate, endDate, reason } = this.ptoForm.value;
    const formattedStartDate = new Date(startDate);
    const formattedEndDate = new Date(endDate);
    const pto = {
      startDate: formattedStartDate.toISOString().split('T')[0],
      endDate: formattedEndDate.toISOString().split('T')[0],
      reason,
    };

    console.log('Submitting PTO:', pto);

    this.apiService.submitPTO(pto).subscribe({
      next: (newPTO) => {
        this.ptos = [...this.ptos, newPTO];
        this.ptoForm.reset();
        this.isLoading = false;
        this.snackBar.open('PTO request submitted', 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.isLoading = false;
        this.snackBar.open('Failed to submit PTO request', 'Close', {
          duration: 3000,
        });
        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      },
    });
  }

  cancelPTO(id: number): void {
    this.apiService.cancelPTO(id).subscribe({
      next: () => {
        this.ptos = this.ptos.filter((pto) => pto.id !== id);
        this.snackBar.open('PTO request canceled', 'Close', { duration: 3000 });
      },
      error: (err) => {
        this.snackBar.open('Failed to cancel PTO request', 'Close', {
          duration: 3000,
        });
        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        }
      },
    });
  }
}
