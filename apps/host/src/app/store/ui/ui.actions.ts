import { createAction } from '@ngrx/store';

export const toggleSidebar = createAction('[UI] Toggle Sidebar');

export const expandSidebar = createAction('[UI] Expand Sidebar');

export const collapseSidebar = createAction('[UI] Collapse Sidebar');

export const openMobileMenu = createAction('[UI] Open Mobile Menu');

export const closeMobileMenu = createAction('[UI] Close Mobile Menu');

export const toggleMobileMenu = createAction('[UI] Toggle Mobile Menu');
