
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
    // async reducer is often needed
    // so we include him by default
    const finalReducer = reduceReducers(reducer, asyncReducer);
    class LocalStore extends Component {
      constructor(...args) {
        super(...args);
        this.store = createStore(finalReducer, initialState, applyMiddleware(...middlewares));
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

