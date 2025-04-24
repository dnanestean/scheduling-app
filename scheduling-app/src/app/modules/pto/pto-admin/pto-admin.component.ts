import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { ApiService } from '../../../core/services/api.service';
import { PTO } from '../types/pto.interface';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pto-admin',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatSnackBarModule,
    MatCardModule,
  ],
  templateUrl: './pto-admin.component.html',
  styleUrls: ['./pto-admin.component.scss'],
})
export class PTOAdminComponent implements OnInit {
  ptos: PTO[] = [];
  displayedColumns: string[] = [
    'username',
    'name',
    'startDate',
    'endDate',
    'reason',
    'status',
    'actions',
  ];

  constructor(
    private apiService: ApiService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadAllPTOs();
  }

  loadAllPTOs(): void {
    this.apiService.getAllPTOs().subscribe({
      next: (ptos) => {
        this.ptos = ptos;
      },
      error: (err) => {
        this.snackBar.open('Failed to load PTO requests', 'Close', {
          duration: 3000,
        });
        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.snackBar.open('Admin access required', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/calendar']);
        }
      },
    });
  }

  updateStatus(id: number, status: 'approved' | 'rejected'): void {
    this.apiService.updatePTOStatus(id, status).subscribe({
      next: (updatedPTO) => {
        this.ptos = this.ptos.map((pto) =>
          pto.id === id
            ? {
                ...pto,
                status: updatedPTO.status,
              }
            : pto
        );
        this.snackBar.open(`PTO request ${status}`, 'Close', {
          duration: 3000,
        });
      },
      error: (err) => {
        this.snackBar.open('Failed to update PTO status', 'Close', {
          duration: 3000,
        });
        if (err.status === 401) {
          localStorage.removeItem('token');
          this.router.navigate(['/login']);
        } else if (err.status === 403) {
          this.snackBar.open('Admin access required', 'Close', {
            duration: 3000,
          });
          this.router.navigate(['/calendar']);
        }
      },
    });
  }
}
