import { createReducer, on } from '@ngrx/store';
import * as UserActions from './user.actions';
import { initialUserState } from './user.state';

function calculateInitials(email: string): string {
  if (!email) return 'U';

  const namePart = email.split('@')[0];
  const parts = namePart.split('.');

  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }

  return namePart.substring(0, 2).toUpperCase();
}

function extractUserName(email: string): string {
  if (!email) return 'Usuario';
  return email.split('@')[0];
}

export const userReducer = createReducer(
  initialUserState,
  on(UserActions.setUser, (state, { email }) => ({
    ...state,
    email,
    userInitials: calculateInitials(email),
    userName: extractUserName(email),
    isAuthenticated: true,
  })),
  on(UserActions.clearUser, () => initialUserState)
);
