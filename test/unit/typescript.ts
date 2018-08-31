import {
  applyMiddleware,
  createStore,
  Dispatch,
  Store,
  Middleware,
} from 'redux';
import { reduxThunkContextMiddleware } from '../../src/index';

const middleware: Middleware = reduxThunkContextMiddleware(() => ({ x: 1 }));
if (middleware) {
}

interface State {
  foo: string;
}

const store: Store<{ foo: string }> = createStore(
  () => ({ foo: 'hi' }),
  { foo: 'yo' },
  applyMiddleware(reduxThunkContextMiddleware(() => 5)),
);

store.dispatch((dispatch: Dispatch<any>) => {
  dispatch({ type: 'FOO' });
});

store.dispatch((dispatch, getState: () => State) => {
  const state = getState();

  const foo: string = state.foo;
  if (foo) {
  }
});

store.dispatch((dispatch, getState, context) => {
  console.log(context); // tslint:disable-line
});

const thunkAction = (dispatch: Dispatch<any>, getState: any, context: any) => {
  const foo: string = getState().foo;
  if (foo) {
  }
  const bar: number = context.bar;
  if (bar) {
  }

  dispatch({ type: 'FOO' });
};
if (thunkAction) {
}

const thunkActionDispatchOnly = (dispatch: Dispatch<any>) => {
  dispatch({ type: 'FOO' });
};
if (thunkActionDispatchOnly) {
}

describe('runs', () => {
  it('compiles and runs', () => {});
});
