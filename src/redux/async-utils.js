import _ from 'lodash';
import { assoc } from 'sprout-data';
import { createAction } from 'redux-act';

const isServer = typeof self == 'undefined';
const registeredActions = Object.create(null);

export function reducer(state = {}, action) {
  const kind = _.get(action, 'meta.kind');

  if (kind == 'async') {
    const { type, namespace, payload } = action.meta;
    switch (type) {
      case 'started':
        return assoc(state,
          [namespace, 'inProgress'], true,
          [namespace, 'finished'], false,
          [namespace, 'err'], null
        );
      case 'succeeded':
        return assoc(state,
          [namespace, 'inProgress'], false,
          [namespace, 'finished'], true,
          [namespace, 'err'], null,
          [namespace, 'isReady'], isServer
        );
      case 'failed':
        return assoc(state,
          [namespace, 'inProgress'], false,
          [namespace, 'finished'], true,
          [namespace, 'err'], payload,
          [namespace, 'isReady'], isServer
        );
      case 'aborted':
        return assoc(state,
          [namespace, 'inProgress'], false,
          [namespace, 'finished'], false,
          [namespace, 'err'], null
        );
      case 'clearErrors':
        return assoc(state,
          [namespace, 'err'], null
        );
      case 'clearErrorsFor':
        const assocArgs = _.flatMap(action.meta.namespaces, ns => [[ns, 'err'], null]);
        return assoc(state, ...assocArgs);
      case 'resetReadyFlag':
        return assoc(state,
          [namespace, 'isReady'], null
        );
      default:
        return state;
    }
  }
  return state;
}

export const clearErrorsFor = createAction('ASYNC_CLEAR_ERRORS', void 0, (...namespaces) => ({
  kind: 'async',
  type: 'clearErrorsFor',
  namespaces,
}));

function createAsyncAction(namespace, type, payloadReducer) {
  const description = `${_.snakeCase(namespace).toUpperCase()}_${type.toUpperCase()}`;

  return createAction(description, payloadReducer, payload => ({
    kind: 'async',
    namespace,
    type,
    payload,
  }));
}

export default function createAsyncActions(namespace, asyncMethod, payloadReducer, options) {
  if (namespace in registeredActions) {
    throw new Error(`You already have ${namespace} action`);
  }
  registeredActions[namespace] = true;

  const opts = _.defaults(options, {
    passthrowError: true,
  });

  const started = createAsyncAction(namespace, 'started', payloadReducer);
  const succeeded = createAsyncAction(namespace, 'succeeded', payloadReducer);
  const failed = createAsyncAction(namespace, 'failed', payloadReducer);
  const aborted = createAsyncAction(namespace, 'aborted', payloadReducer);
  const clearErrors = createAsyncAction(namespace, 'clearErrors', payloadReducer);
  const resetReadyFlag = createAsyncAction(namespace, 'resetReadyFlag', payloadReducer);

  const perform = (...args) => {
    return (dispatch, getState, api) => {
      const handleError = (err) => {
        const httpStatus = _.get(err, 'response.status');
        if (httpStatus != 404) {
          console.error(err);
          if (err && err.stack) {
            console.error(err.stack);
          }
        }
        dispatch(failed(err, ...args));
        if (opts.passthrowError) {
          throw err;
        }
      };

      const callContext = {
        dispatch,
        getState,
        api,
      };

      dispatch(started(...args));
      const promise = asyncMethod.call(callContext, ...args);
      const abort = () => {
        if (promise.abort) promise.abort();
        dispatch(aborted());
      };

      let result = promise
        .then(
          (res) => {
            dispatch(succeeded(res, ...args));
            return res;
          },
          handleError
        );

      // caching errors hinder debugging process
      // but in production it leads to more expected behaviour
      if (process.env.NODE_ENV === 'production') {
        result = result.catch(handleError);
      }
      result.abort = abort;
      return result;
    };
  };

  let promise;

  const lazyPerform = (...args) => {
    return (dispatch, getState) => {
      const asyncState = _.get(getState(), ['asyncActions', namespace]);
      if (asyncState && isServer && (asyncState.inProgress || asyncState.finished)) {
        return promise;
      }

      // if we already have hydrated state at server we don't need do request for first time
      if (asyncState && !isServer && asyncState.isReady) {
        dispatch(resetReadyFlag());
        // return empty promise in case if we have hydrated state
        return Promise.resolve();
      }

      promise = dispatch(perform(...args));
      return promise;
    };
  };

  return {
    fetch: lazyPerform, // for backward compatibility
    perform: lazyPerform,
    started,
    succeeded,
    failed,
    clearErrors,
    resetReadyFlag,
  };
}
