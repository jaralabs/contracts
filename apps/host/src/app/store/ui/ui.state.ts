export interface UiState {
  isSidebarExpanded: boolean;
  isMobileMenuOpen: boolean;
}

export const initialUiState: UiState = {
  isSidebarExpanded: true,
  isMobileMenuOpen: false,
};
