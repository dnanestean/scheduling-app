import { Component, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBarModule, MatSnackBar } from '@angular/material/snack-bar';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { PTO } from '../pto/types/pto.interface';
import { Holiday } from './types/holiday.interface';
import { Router } from '@angular/router';
import { FullCalendarComponent } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [
    CommonModule,
    FullCalendarModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatSnackBarModule,
  ],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarRef!: FullCalendarComponent;

  calendarOptions: CalendarOptions = {
    plugins: [dayGridPlugin, timeGridPlugin],
    initialView: 'dayGridMonth',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek',
    },
    events: [],
    eventContent: this.renderEventContent.bind(this),
  };

  viewModes = [
    { value: 'dayGridMonth', label: 'Monthly' },
    { value: 'timeGridWeek', label: 'Weekly' },
  ];

  constructor(
    private apiService: ApiService,
    private authService: AuthService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    console.log('Token before request:', localStorage.getItem('auth_token'));
    this.authService.isAdmin().subscribe((isAdmin) => {
      console.log('Is Admin:', isAdmin);
      const ptoObservable = isAdmin
        ? this.apiService.getAllPTOs()
        : this.apiService.getUserPTOs();

      ptoObservable.subscribe({
        next: (ptos: PTO[]) => {
          console.log('Calendar PTOs:', ptos);
          const ptoEvents: EventInput[] = ptos.map((pto) => {
            const startDate = new Date(pto.startDate);
            startDate.setDate(startDate.getDate() + 1);
            const endDate = new Date(pto.endDate);
            endDate.setDate(endDate.getDate() + 2);
            const title = isAdmin
              ? `PTO (${pto.status}) - ${pto.username || 'Unknown'}`
              : `PTO (${pto.status})`;
            const event = {
              title,
              start: startDate.toISOString().split('T')[0],
              end: endDate.toISOString().split('T')[0],
              backgroundColor: this.getPTOColor(pto.status),
              borderColor: this.getPTOColor(pto.status),
              extendedProps: {
                type: 'pto',
                status: pto.status,
                reason: pto.reason,
                username: pto.username,
              },
              allDay: true,
            };
            console.log('PTO Event:', event);
            return event;
          });

          this.apiService.getHolidays().subscribe({
            next: (holidays: Holiday[]) => {
              const holidayEvents: EventInput[] = holidays.map((holiday) => {
                const holidayDate = new Date(holiday.date);
                const formattedDate = `${holidayDate.getFullYear()}-${(
                  holidayDate.getMonth() + 1
                )
                  .toString()
                  .padStart(2, '0')}-${holidayDate
                  .getDate()
                  .toString()
                  .padStart(2, '0')}`;
                const event = {
                  title: holiday.name,
                  start: formattedDate,
                  end: formattedDate,
                  allDay: true,
                  backgroundColor: '#2196f3',
                  borderColor: '#2196f3',
                  extendedProps: { type: 'holiday', country: holiday.country },
                };
                return event;
              });

              this.calendarOptions.events = [...ptoEvents, ...holidayEvents];
              console.log('Calendar Events:', this.calendarOptions.events);

              setTimeout(() => {
                const calendarApi = this.calendarRef?.getApi();
                if (calendarApi) {
                  console.log(
                    'Rendered Events:',
                    calendarApi.getEvents().map((e) => ({
                      title: e.title,
                      start: e.start,
                      end: e.end,
                    }))
                  );
                } else {
                  console.warn('Calendar API not available');
                }
              }, 500);
            },
            error: (err) => {
              console.error('Holidays error:', err);
              const mockHolidays: Holiday[] = [
                {
                  id: 1,
                  name: 'Independence Day',
                  date: '2025-07-04',
                  country: undefined,
                },
              ];
              const holidayEvents: EventInput[] = mockHolidays.map(
                (holiday) => {
                  const event = {
                    title: holiday.name,
                    start: holiday.date,
                    end: holiday.date,
                    allDay: true,
                    backgroundColor: '#2196f3',
                    borderColor: '#2196f3',
                    extendedProps: { type: 'holiday' },
                  };
                  console.log('Holiday Event:', event);
                  return event;
                }
              );

              this.calendarOptions.events = [...ptoEvents, ...holidayEvents];
              console.log('Calendar Events:', this.calendarOptions.events);
            },
          });
        },
        error: (err) => {
          this.snackBar.open('Failed to load calendar events', 'Close', {
            duration: 3000,
          });
          if (err.status === 401) {
            console.log('401 Error - Clearing token and redirecting to login');
            localStorage.removeItem('auth_token');
            this.router.navigate(['/login']);
          }
          console.error('PTOs error:', err);
        },
      });
    });
  }

  getPTOColor(status: string): string {
    switch (status) {
      case 'approved':
        return '#4caf50';
      case 'pending':
        return '#ffeb3b';
      case 'rejected':
        return '#f44336';
      default:
        return '#000000';
    }
  }

  renderEventContent(arg: any): any {
    const event = arg.event;
    const props = event.extendedProps;
    const title =
      props.type === 'pto' ? `${event.title} - ${props.reason}` : event.title;
    console.log('Rendered Event:', {
      title,
      start: arg.event.start,
      end: arg.event.end,
    });
    return {
      html: `
        <div class="fc-event-content">
          <span>${title}</span>
        </div>
      `,
    };
  }

  changeView(view: string): void {
    this.calendarOptions.initialView = view;
    const calendarApi = this.calendarRef?.getApi();
    if (calendarApi) {
      calendarApi.changeView(view);
    } else {
      console.warn('Calendar API not available in changeView');
    }
  }
}
