import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { LayoutComponent as DesignSystemLayout } from '@contracts/design-system';
import { AuthService } from '@contracts/shared';
import { Store } from '@ngrx/store';
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
  isSidebarExpanded$ = this.store.select(selectIsSidebarExpanded);
  isMobileMenuOpen$ = this.store.select(selectIsMobileMenuOpen);
  userInitials$ = this.store.select(selectUserInitials);
  userName$ = this.store.select(selectUserName);

  constructor(private store: Store<AppState>, public authService: AuthService) {
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
    await this.authService.logout();
    const { clearUser } = await import('../store');
    this.store.dispatch(clearUser());
  }
}
