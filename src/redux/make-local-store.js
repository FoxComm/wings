
import React, { Component } from 'react';
import { applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import reduceReducers from 'reduce-reducers';
import { reducer as asyncReducer } from './async-utils';
import hoistNonReactStatic from 'hoist-non-react-statics';

function getDisplayName(WrappedComponent) {
  return WrappedComponent.displayName || WrappedComponent.name || 'Component';
}

// creates local store for given component
// usage:
// _.flowRight(
//   makeLocalStore(reducer),
//   connect(mapLocalStateToProps)
// )(Component);
export default function makeLocalStore(reducer, initialState = {}, middlewares = [thunk]) {
  return WrappedComponent => {
    class LocalStore extends Component {
      constructor(...args) {
        super(...args);
        this.store = createStore(reducer, initialState, applyMiddleware(...middlewares));
      }

      render() {
        return (
          <WrappedComponent
            {...this.props}
            store={this.store}
          />
        );
      }
    }

    LocalStore.displayName = `LocalStore(${getDisplayName(WrappedComponent)})`;

    return hoistNonReactStatic(LocalStore, WrappedComponent);
  };
}

type ShouldReturnObject = (state: any, action: any) => Object;

export function addAsyncReducer(reducer: ShouldReturnObject, namespace = 'asyncActions') {
  if (!namespace) return reduceReducers(reducer, asyncReducer);

  return (state, action) => {
    const newState = reducer(state, action);
    const asyncState = state[namespace];
    return {
      ...newState,
      [namespace]: asyncReducer(asyncState, action),
    };
  }
}

