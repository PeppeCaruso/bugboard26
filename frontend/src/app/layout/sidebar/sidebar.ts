import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService, User } from '../../core/services/auth.service';
import { MatSidenavModule } from '@angular/material/sidenav';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatListModule,
    MatIconModule,
    MatDividerModule,
    MatTooltipModule,
    MatSidenavModule,
  ],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class SidebarComponent implements OnInit {
  currentUser: User | null = null;

  menuItems = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard', adminOnly: false },
    { label: 'Issues', icon: 'assignment', route: '/issues', adminOnly: false },
    { label: 'Archivio', icon: 'inventory_2', route: '/archived', adminOnly: true },
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.authService.getMe().subscribe({
      next: (user) => (this.currentUser = user),
      error: () => (this.currentUser = null),
    });
  }

  getInitials(): string {
    if (!this.currentUser) return '?';
    return (
      this.currentUser.firstName.charAt(0) +
      this.currentUser.lastName.charAt(0)
    ).toUpperCase();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  isCreateUserRoute(): boolean {
    return this.router.url === '/users/create';
  }
}