import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { PTO } from '../../modules/pto/types/pto.interface';
import { Holiday } from '../../modules/calendar/types/holiday.interface';
import { User } from '../../modules/profile/types/user.interface';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(catchError(this.handleError));
  }

  getUserInfo(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/auth/me`)
      .pipe(catchError(this.handleError));
  }

  getUserProfile(): Observable<User> {
    return this.http
      .get<User>(`${this.apiUrl}/auth/me`)
      .pipe(catchError(this.handleError));
  }

  updateUserProfile(data: { name: string; country: string }): Observable<User> {
    return this.http
      .put<User>(`${this.apiUrl}/users/me`, data)
      .pipe(catchError(this.handleError));
  }

  getHolidays(country?: string): Observable<Holiday[]> {
    let params = new HttpParams();
    if (country) {
      params = params.set('country', country);
    }
    return this.http
      .get<Holiday[]>(`${this.apiUrl}/holidays`, { params })
      .pipe(catchError(this.handleError));
  }

  addHoliday(holiday: {
    name: string;
    date: string;
    country: string;
  }): Observable<Holiday> {
    return this.http
      .post<Holiday>(`${this.apiUrl}/admin/holidays`, holiday)
      .pipe(catchError(this.handleError));
  }

  submitPTO(pto: {
    startDate: string;
    endDate: string;
    reason: string;
  }): Observable<PTO> {
    return this.http
      .post<PTO>(`${this.apiUrl}/ptos`, pto)
      .pipe(catchError(this.handleError));
  }

  getUserPTOs(): Observable<PTO[]> {
    return this.http
      .get<PTO[]>(`${this.apiUrl}/ptos`)
      .pipe(catchError(this.handleError));
  }

  cancelPTO(id: number): Observable<{ message: string }> {
    return this.http
      .delete<{ message: string }>(`${this.apiUrl}/ptos/${id}`)
      .pipe(catchError(this.handleError));
  }

  getAllPTOs(): Observable<PTO[]> {
    return this.http
      .get<PTO[]>(`${this.apiUrl}/ptos/all`)
      .pipe(catchError(this.handleError));
  }

  updatePTOStatus(
    id: number,
    status: 'approved' | 'rejected'
  ): Observable<PTO> {
    return this.http
      .put<PTO>(`${this.apiUrl}/ptos/${id}`, { status })
      .pipe(catchError(this.handleError));
  }

  private handleError(error: any): Observable<never> {
    console.error('API error:', error);
    return throwError(() => error);
  }
}
