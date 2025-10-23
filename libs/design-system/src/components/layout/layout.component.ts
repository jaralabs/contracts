import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import {
  Bell,
  ChevronLeft,
  ChevronRight,
  FileText,
  Home,
  LogOut,
  LucideAngularModule,
  Menu,
} from 'lucide-angular';

@Component({
  selector: 'lib-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, LucideAngularModule],
  templateUrl: './layout.component.html',
})
export class LayoutComponent {
  readonly Home = Home;
  readonly FileText = FileText;
  readonly LogOut = LogOut;
  readonly Bell = Bell;
  readonly ChevronLeft = ChevronLeft;
  readonly ChevronRight = ChevronRight;
  readonly Menu = Menu;

  @Input() isSidebarExpanded: boolean | null = true;
  @Input() isMobileMenuOpen: boolean | null = false;

  @Input() userInitials: string | null = 'U';
  @Input() userName: string | null = 'Usuario';

  @Input() onToggleSidebar?: () => void;
  @Input() onToggleMobileMenu?: () => void;
  @Input() onCloseMobileMenu?: () => void;
  @Input() onLogoutCallback?: () => void;

  toggleSidebarExpansion() {
    this.onToggleSidebar?.();
  }

  toggleMobileMenu() {
    this.onToggleMobileMenu?.();
  }

  closeMobileMenu() {
    this.onCloseMobileMenu?.();
  }

  onLogout() {
    this.onLogoutCallback?.();
  }
}
