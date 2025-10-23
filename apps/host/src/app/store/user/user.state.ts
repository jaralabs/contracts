export interface UserState {
  email: string | null;
  userInitials: string;
  userName: string;
  isAuthenticated: boolean;
}

export const initialUserState: UserState = {
  email: null,
  userInitials: 'U',
  userName: 'Usuario',
  isAuthenticated: false,
};
