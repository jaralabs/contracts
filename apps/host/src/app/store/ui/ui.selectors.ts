import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UiState } from './ui.state';

export const selectUiState = createFeatureSelector<UiState>('ui');

export const selectIsSidebarExpanded = createSelector(
  selectUiState,
  (state: UiState) => state.isSidebarExpanded
);

export const selectIsMobileMenuOpen = createSelector(
  selectUiState,
  (state: UiState) => state.isMobileMenuOpen
);
