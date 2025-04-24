import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap, catchError, of } from 'rxjs';
import { User } from '../models/user.model';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:3000';
  private tokenKey = 'auth_token';
  private isLoggedInSubject = new BehaviorSubject<boolean>(
    !!localStorage.getItem(this.tokenKey)
  );
  private isAdminSubject = new BehaviorSubject<boolean>(false);
  private currentUserSubject = new BehaviorSubject<User | null>(null);

  constructor(private http: HttpClient, private router: Router) {
    if (this.isLoggedInSubject.getValue()) {
      this.updateUserAndAdminStatus();
    }
  }

  login(username: string, password: string): Observable<{ token: string }> {
    return this.http
      .post<{ token: string }>(`${this.apiUrl}/auth/login`, {
        username,
        password,
      })
      .pipe(
        tap((response) => {
          if (response.token) {
            localStorage.setItem(this.tokenKey, response.token);
            this.isLoggedInSubject.next(true);
            this.updateUserAndAdminStatus();
            console.log('AuthService: Logged in, token set:', response.token);
          }
        }),
        catchError((err) => {
          console.error('AuthService: Login error:', err);
          return of(err);
        })
      );
  }

  getCurrentUser(): Observable<User | null> {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      return of(currentUser);
    }
    return this.http.get<User>(`${this.apiUrl}/auth/me`).pipe(
      tap((user) => {
        this.currentUserSubject.next(user);
      }),
      catchError((err) => {
        console.error('AuthService: getCurrentUser error:', err);
        if (err.status === 401) {
          this.logout();
        }
        return of(null);
      })
    );
  }

  getUserProfile(): Observable<User | null> {
    return this.getCurrentUser();
  }

  isLoggedIn(): Observable<boolean> {
    return this.isLoggedInSubject.asObservable();
  }

  isAdmin(): Observable<boolean> {
    return this.isAdminSubject.asObservable();
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.isLoggedInSubject.next(false);
    this.isAdminSubject.next(false);
    this.currentUserSubject.next(null);
    console.log('AuthService: Logged out');
    this.router.navigate(['/login']);
  }

  private updateUserAndAdminStatus(): void {
    this.getCurrentUser().subscribe({
      next: (user) => {
        if (user) {
          const isAdmin = user.role === 'admin';
          this.isAdminSubject.next(isAdmin);
          console.log('AuthService: isAdmin:', isAdmin, 'User:', user);
        } else {
          this.isAdminSubject.next(false);
          this.isLoggedInSubject.next(false);
        }
      },
      error: (err) => {
        console.error('AuthService: updateUserAndAdminStatus error:', err);
        if (err.status === 401) {
          this.logout();
        } else {
          this.isAdminSubject.next(false);
          this.isLoggedInSubject.next(false);
        }
      },
    });
  }

  static getToken(): string | null {
    return localStorage.getItem('auth_token');
  }
}
