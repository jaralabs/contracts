import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent as DesignSystemLayout } from '@contracts/design-system';
import { Store } from '@ngrx/store';
import { AuthService } from '../services/auth.service';
import {
  AppState,
  closeMobileMenu,
  selectIsMobileMenuOpen,
  selectIsSidebarExpanded,
  selectUserInitials,
  selectUserName,
  setUser,
  toggleMobileMenu,
  toggleSidebar,
} from '../store';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [AsyncPipe, RouterModule, DesignSystemLayout],
  template: `
    <lib-layout
      [isSidebarExpanded]="isSidebarExpanded$ | async"
      [isMobileMenuOpen]="isMobileMenuOpen$ | async"
      [userInitials]="userInitials$ | async"
      [userName]="userName$ | async"
      [onToggleSidebar]="handleToggleSidebar.bind(this)"
      [onToggleMobileMenu]="handleToggleMobileMenu.bind(this)"
      [onCloseMobileMenu]="handleCloseMobileMenu.bind(this)"
      [onLogoutCallback]="handleLogout.bind(this)"
    >
      <router-outlet></router-outlet>
    </lib-layout>
  `,
})
export class LayoutComponent {
  // Selectors from NgRx Store
  isSidebarExpanded$ = this.store.select(selectIsSidebarExpanded);
  isMobileMenuOpen$ = this.store.select(selectIsMobileMenuOpen);
  userInitials$ = this.store.select(selectUserInitials);
  userName$ = this.store.select(selectUserName);

  constructor(private store: Store<AppState>, public authService: AuthService) {
    // Initialize user data from auth service
    const user = this.authService.currentUser();
    if (user?.email) {
      this.store.dispatch(setUser({ email: user.email }));
    }
  }

  handleToggleSidebar() {
    this.store.dispatch(toggleSidebar());
  }

  handleToggleMobileMenu() {
    this.store.dispatch(toggleMobileMenu());
  }

  handleCloseMobileMenu() {
    this.store.dispatch(closeMobileMenu());
  }

  async handleLogout() {
    try {
      await this.authService.logout();
      // Limpiar el estado del store después del logout
      const { clearUser } = await import('../store');
      this.store.dispatch(clearUser());
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  }
}
