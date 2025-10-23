import { createAction, props } from '@ngrx/store';

export const setUser = createAction(
  '[User] Set User',
  props<{ email: string }>()
);

export const clearUser = createAction('[User] Clear User');

export const loadUserFromAuth = createAction('[User] Load User From Auth');
