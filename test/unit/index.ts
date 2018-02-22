import * as chai from 'chai';
import { Dispatch } from 'redux';
import { reduxThunkContextMiddleware } from '../../src/index';

interface State {
  x: 1;
}

describe('thunk middleware', () => {
  const doDispatch: any = () => {};
  const doGetState: () => State = () => ({ x: 1 });
  const createContext = () => ({ context: true });
  const nextHandler = reduxThunkContextMiddleware<any, State, any>(
    createContext,
  )({ dispatch: doDispatch, getState: doGetState });

  it('must return a function to handle next', () => {
    chai.assert.isFunction(nextHandler);
    chai.assert.strictEqual(nextHandler.length, 1);
  });

  describe('handle next', () => {
    it('must return a function to handle action', () => {
      const actionHandler = nextHandler(() => 5);

      chai.assert.isFunction(actionHandler);
      chai.assert.strictEqual(actionHandler.length, 1);
    });

    describe('handle action', () => {
      it('must run the given action function with dispatch and getState', done => {
        const actionHandler = nextHandler(() => 5);

        actionHandler((dispatch: Dispatch<State>, getState: () => State) => {
          chai.assert.strictEqual(getState, doGetState);
          done();
        });
      });

      it('must pass action to next if not a function', done => {
        const actionObj = { type: 'a' };

        const actionHandler = nextHandler(action => {
          chai.assert.strictEqual(action, actionObj);
          done();
        });

        actionHandler(actionObj);
      });

      it('must return the return value of next if not a function', () => {
        const expected = 'redux';
        const actionHandler = nextHandler(() => expected);

        const outcome = actionHandler({ type: 'hi' });
        chai.assert.strictEqual(outcome, expected);
      });

      it('must return value as expected if a function', () => {
        const expected = 'rocks';
        const actionHandler = nextHandler(() => 5);

        const outcome = actionHandler(() => expected);
        chai.assert.strictEqual(outcome, expected);
      });

      it('must be invoked synchronously if a function', () => {
        const actionHandler = nextHandler(() => 5);
        let mutated = 0;

        actionHandler(() => mutated++);
        chai.assert.strictEqual(mutated, 1);
      });
    });
  });
});
