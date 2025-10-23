import { ActionReducerMap } from '@ngrx/store';
import { uiReducer } from './ui/ui.reducer';
import { UiState } from './ui/ui.state';
import { userReducer } from './user/user.reducer';
import { UserState } from './user/user.state';

export interface AppState {
  ui: UiState;
  user: UserState;
}

export const appReducers: ActionReducerMap<AppState> = {
  ui: uiReducer,
  user: userReducer,
};

export * from './ui/ui.actions';
export * from './user/user.actions';

export * from './ui/ui.selectors';
export * from './user/user.selectors';
