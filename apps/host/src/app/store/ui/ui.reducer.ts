import { createReducer, on } from '@ngrx/store';
import * as UiActions from './ui.actions';
import { initialUiState } from './ui.state';

export const uiReducer = createReducer(
  initialUiState,
  on(UiActions.toggleSidebar, (state) => ({
    ...state,
    isSidebarExpanded: !state.isSidebarExpanded,
  })),
  on(UiActions.expandSidebar, (state) => ({
    ...state,
    isSidebarExpanded: true,
  })),
  on(UiActions.collapseSidebar, (state) => ({
    ...state,
    isSidebarExpanded: false,
  })),
  on(UiActions.openMobileMenu, (state) => ({
    ...state,
    isMobileMenuOpen: true,
  })),
  on(UiActions.closeMobileMenu, (state) => ({
    ...state,
    isMobileMenuOpen: false,
  })),
  on(UiActions.toggleMobileMenu, (state) => ({
    ...state,
    isMobileMenuOpen: !state.isMobileMenuOpen,
  }))
);
