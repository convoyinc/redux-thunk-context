import { Action } from 'redux';

export type ThunkAction<R, S, C> = (
  dispatch: Dispatch<S>,
  getState: () => S,
  context: C,
) => R;
// export type ActionThunkAction<R, S, C> = Action | ThunkAction<R, S, C>;
// export type ThunkContextAction<R, S, C> = ActionThunkAction<R, S, C> | ContextAction<R, S, C>;

export interface Dispatch<S> {
  <R, C>(action: ThunkAction<R, S, C>): R;
}

declare module 'redux' {
  export interface Dispatch<S> {
    <R, C>(action: ThunkAction<R, S, C>): R;
  }
}

export function reduxThunkContextMiddleware<R, S, C>(createContext: () => C) {
  return (args: { dispatch: Dispatch<S>; getState: () => S }) => (
    next: (action: ThunkAction<R, S, C> | Action) => R,
  ) => (action: ThunkAction<R, S, C> | Action) => {
    if (action instanceof ContextAction) {
      return action.action(
        wrapDispatch(args.dispatch, action.context) as any,
        args.getState,
        action.context,
      );
    } else if (typeof action === 'function') {
      const context = createContext();
      return action(
        wrapDispatch(args.dispatch, context) as any,
        args.getState,
        context,
      );
    }

    return next(action);
  };
}

function wrapDispatch<R, S, C>(dispatch: Dispatch<S>, context: C) {
  return function dispatchWithContext(action: ThunkAction<R, S, C>) {
    if (typeof action === 'function') {
      return dispatch(new ContextAction(context, action) as any);
    }
    return dispatch(action);
  };
}

export class ContextAction<R, S, C> {
  constructor(public context: C, public action: ThunkAction<R, S, C>) {}
}
