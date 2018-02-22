# redux-thunk-context
Thunk middleware for Redux with a context object.

This is a replacement for the redux-thunk library, which allows you to dispatch multiple asynchronous actions. This library maintains a single context object (or in redux-thunk terminology: third argument) throughout the entire call stack of a thunk. This means that every function a thunk dispatches will receive the same context object the current function has. This is helpful when implementing asynchronous APM tracing.

## Getting started
```
npm install redux-thunk-context --save
npm uninstall redux-thunk --save
```

To get started, replace your redux-thunk calls with redux-thunk-context

```
import { reduxThunkContextMiddleware } from 'redux-thunk-context';

const store = createStore(
  reducer,
  applyMiddleware(reduxThunkContextMiddleware(() => { api })),
)

// later
function fetchUser(id) {
  return (dispatch, getState, context) => {
    // you can use context.api here
    dispatch(fetchMore(id));
  }
}

function fetchMore(id) {
  return (dispatch, getState, context) => {
    // the exact same context object as fetchUser
  }
}
```

`reduxThunkContextMiddleware` takes one argument, a function that creates a context object for a call stack to use. Note that it adds a `_contextObject: true` property to the object to identify it as a context object.
