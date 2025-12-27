# Application Routes

This document outlines all the routes in the Payroll Management System application, the components they render, and the data they require.

## Common

| Path | Component | Data Needs (Props) | Data Structure Example | Description |
|---|---|---|---|
| `/` | `Navigate` | `to="/login"` | - | Redirects the root path to the login page. |
| `/login` | `Login` | - | `email` (string), `password` (string), `role` (string: 'admin', 'hr', or 'employee') | Handles user authentication based on email, password, and role, then redirects to the appropriate dashboard. |
| `/logout` | `Navigate` | `to="/login"` | - | Logs the user out and redirects to the login page. |
| `*` | `NotFoundPage` | - | - | Catches all unmatched routes and displays a 404 "Page Not Found" error. |

---

## Admin Routes

All admin routes are prefixed with `/admin` and are wrapped in the `Layout` component, which provides a consistent sidebar and navbar for the admin section.

| Path | Component | Data Needs (Props) | Data Structure Example | Description |
|---|---|---|---|
| `/dashboard` | `AdminDashboard` | - | `cardData`: `[{ id, title, value, icon }]`, `payrollData`: `[{ month, expense }]`, `attendanceData`: `[{ day, present }]`, `upcomingEvents`: `[{ id, title, date, time }]` | Displays a dashboard with key metrics (cards), charts for payroll and attendance, and a list of upcoming events. |
| `/employees` | `EmployeesPage` | - | `employees`: `[{ id, photo, name, email, department, designation, joiningDate, status }]` | Shows a searchable and filterable table of all employees. Includes actions to view, edit, or delete an employee. |
| `/employees/:employeeId` | `AdminEmployeeProfilePage` | `employeeId` from URL | `employeeData`: `{ id, name, designation, ..., personalInfo: { email, phone, ... }, jobInfo: { ... }, salaryDetails: { ... }, documents: [{ id, name, type }] }` | Displays the detailed profile of a single employee, identified by `employeeId`. Information is organized into tabs. |
| `/attendance` | `AttendancePage` | - | `employees`: `[{ id, name, status }]`, `selectedDate` (Date object) | Allows an admin to view and manage employee attendance for a specific date. |
| `/payroll` | `PayrollPage` | - | `employees`: `[{ id, name, salary, deductions }]` | Manages payroll, showing a list of employees with their salary details. Allows for generating individual payslips. |
| `/deductions` | `DeductionsPage` | - | `deductions`: `[{ id, name, amount, type }]` | Manages salary deductions. An admin can add, edit, or delete deduction types (e.g., Health Insurance). |
| `/reports` | `ReportsPage` | - | - | A page that provides links to generate various reports, such as payroll summaries, employee directories, and attendance logs. |
| `/settings` | `SettingsPage` | - | Form fields for company name, address, email, pay frequency, pay day, and notification settings. | Allows an admin to configure global application settings. |

---

## HR Routes

All HR routes are prefixed with `/hr` and use the `HRLayout` component, providing a consistent UI for the HR section.

| Path | Component | Data Needs (Props) | Data Structure Example | Description |
|---|---|---|---|
| `/dashboard` | `HRDashboard` | - | Same as `AdminDashboard`. | Displays a dashboard tailored for HR personnel with key metrics and charts. |
| `/employees` | `HREmployeesPage` | - | Same as `EmployeesPage`. | Provides a list of employees, similar to the admin view, for HR management. |
| `/employees/:employeeId` | `HREmployeeProfilePage` | `employeeId` from URL | Same as `AdminEmployeeProfilePage`. | Displays the detailed profile of a single employee for HR review. |
| `/attendance` | `HRAttendancePage` | - | Same as `AttendancePage`. | Allows HR to manage and track employee attendance. |
| `/payroll` | `HRPayrollPage` | - | Same as `PayrollPage`. | Enables HR to manage payroll and generate payslips. |
| `/deductions` | `HRDeductionsPage` | - | Same as `DeductionsPage`. | Allows HR to manage salary deductions. |
| `/reports` | `HRReportsPage` | - | - | Provides HR-specific reports. |
| `/settings` | `SettingsPage` | - | Same as `SettingsPage` in admin. | Allows HR to configure application settings. |

---

## Employee Routes

All employee routes are prefixed with `/employee` and use the `EmployeeLayout` component for a consistent employee-facing UI.

| Path | Component | Data Needs (Props) | Data Structure Example | Description |
|---|---|---|---|
| `/dashboard` | `EmployeeDashboard` | - | `employee`: `{ name, department, designation, avatar }`, `recentPayslips`: `[{ id, month, year, amount }]`, `upcomingHolidays`: `[{ id, name, date }]` | A personalized dashboard for the logged-in employee, showing their info, recent payslips, and upcoming holidays. |
| `/profile` | `ProfilePage` | - | `employeeData`: `{ id, name, designation, ..., personalInfo: { ... }, jobInfo: { ... } }` | Displays the employee's own profile information in a read-only format. |
| `/payslip` | `PayslipPage` | - | `payslips`: `[{ id, month, year, gross, deductions, net, file }]` | Shows a list of the employee's past payslips, with options to download or print each one. |
| `/attendance` | `AttendancePage` | - | `attendanceData`: `[{ date, status }]` | Displays the employee's personal attendance history. |
| `/leave` | `LeavePage` | - | `leaveHistory`: `[{ id, type, from, to, status }]` | Allows the employee to submit a leave request and view the status of their past and pending requests. |