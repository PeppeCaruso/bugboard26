import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login';
import { MainLayoutComponent } from './layout/main-layout/main-layout';
import { DashboardComponent } from './dashboard/dashboard';
import { authGuard } from './core/auth.guard';
import { CreateIssueComponent } from './issues/create-issue/create-issue';
import { IssueListComponent } from './issues/issue-list/issue-list';
import { IssueDetailComponent } from './issues/issue-detail/issue-detail';
import { CreateUserComponent } from './users/create-user/create-user';
import { ArchivedIssuesComponent } from './issues/archived-issues/archived-issues';
import { adminGuard } from './core/admin.guard';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: MainLayoutComponent,
    canActivate: [authGuard],
    children: [
      { path: 'dashboard', component: DashboardComponent },
      { path: 'issues', component: IssueListComponent },
      { path: 'issues/create', component: CreateIssueComponent },
      { path: 'issues/:id', component: IssueDetailComponent },
      { path: 'archived', component: ArchivedIssuesComponent, canActivate: [adminGuard] },
      { path: 'users/create', component: CreateUserComponent },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ],
  },
];