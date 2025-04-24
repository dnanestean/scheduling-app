import { Routes } from '@angular/router';
import { LoginComponent } from './modules/auth/login/login.component';
import { CalendarComponent } from './modules/calendar/calendar.component';
import { ProfileComponent } from './modules/profile/profile.component';
import { PTORequestComponent } from './modules/pto/pto-request/pto-request.component';
import { PTOAdminComponent } from './modules/pto/pto-admin/pto-admin.component';
import { HolidayAdminComponent } from './modules/holidays/holiday-admin/holiday-admin.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'pto-request', component: PTORequestComponent },
  { path: 'pto-admin', component: PTOAdminComponent },
  { path: 'holiday-admin', component: HolidayAdminComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
