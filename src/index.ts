import { Action } from 'redux';

export type ThunkContextAction<R, S, C> = (
  dispatch: ThunkContextDispatch<S>,
  getState: () => S,
  context: C,
) => R;

export interface ThunkContextDispatch<S> {
  <R, C>(action: ThunkContextAction<R, S, C>): R;
}

declare module 'redux' {
  export interface Dispatch<A extends Action = AnyAction> {
    <R, S, C>(action: ThunkContextAction<R, S, C>): R;
  }
}

export function reduxThunkContextMiddleware<R, S, C>(createContext: () => C) {
  return (args: { dispatch: ThunkContextDispatch<S>; getState: () => S }) => (
    next: (action: ThunkContextAction<R, S, C> | Action) => R,
  ) => (action: ThunkContextAction<R, S, C> | Action) => {
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

function wrapDispatch<R, S, C>(dispatch: ThunkContextDispatch<S>, context: C) {
  return function dispatchWithContext(action: ThunkContextAction<R, S, C>) {
    if (typeof action === 'function') {
      return dispatch(new ContextAction(context, action) as any);
    }
    return dispatch(action);
  };
}

export class ContextAction<R, S, C> {
  constructor(public context: C, public action: ThunkContextAction<R, S, C>) {}
}
