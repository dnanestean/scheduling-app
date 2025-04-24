# Scheduling App

The Scheduling App is a web application for managing paid time off (PTO) and viewing national holidays. It features a calendar interface, user authentication, and admin functionalities for managing holidays and PTO requests. The frontend is built with Angular 17, and the backend is a Node.js API using Hapi with JWT authentication.

## Features

- **User Authentication**: Login/logout with JWT-based authentication (e.g., `admin`/`admin123`, `testuser`/`password123`).
- **PTO Management**:
  - Users can request and view their PTOs on a calendar.
  - Admins can approve/reject all PTO requests.
- **National Holidays**:
  - Admins can add holidays 
- **Calendar View**: FullCalendar integration displays PTOs and holidays, with clickable events for details.
- **Responsive UI**: Built with Angular Material for a modern interface.
- **Role-Based Access**: Admins manage all PTOs/holidays; users manage their own PTOs.

## Prerequisites

- **Node.js**: v18.x or later
- **npm**: v9.x or later
- **Angular CLI**: v17.x (`npm install -g @angular/cli`)
- **Git**: For cloning the repository


## Running the Application
After installing the dependencies and initializing the db:

**1. Start the Backend**:
Navigate to the backend directory: cd scheduling-api
Start the server: node server.js
Runs on http://localhost:3000.
On first run, it seeds users: admin/admin, testuser/password123.

**2. Start the Frontend**:
Navigate to the frontend directory: cd ../scheduling-app
Start the Angular app: ng serve
Runs on http://localhost:4200.
Open http://localhost:4200 in your browser.

