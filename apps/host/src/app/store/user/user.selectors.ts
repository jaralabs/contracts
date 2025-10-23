import { createFeatureSelector, createSelector } from '@ngrx/store';
import { UserState } from './user.state';

export const selectUserState = createFeatureSelector<UserState>('user');

export const selectUserEmail = createSelector(
  selectUserState,
  (state: UserState) => state.email
);

export const selectUserInitials = createSelector(
  selectUserState,
  (state: UserState) => state.userInitials
);

export const selectUserName = createSelector(
  selectUserState,
  (state: UserState) => state.userName
);

export const selectIsAuthenticated = createSelector(
  selectUserState,
  (state: UserState) => state.isAuthenticated
);
