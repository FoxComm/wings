/* @flow */

import _ from 'lodash';
import classNames from 'classnames';
import React from 'react';
import Alert from './alert';
import AutoScroll from '../common/auto-scroll';

const UNEXPECTED_ERROR = 'Something went wrong. We are investigating it now.';

function parseError(err) {
  if (!err) return null;

  const serverErrors = _.get(err, ['responseJson', 'errors']);
  if (serverErrors) return serverErrors;

  if (err.toString() !== '[object Object]') {
    return [err.toString()];
  }

  if (process.env.NODE_ENV !== 'production') {
    const errObject = _.get(err, 'responseJson', err);
    return [`Something went wrong: \n${JSON.stringify(errObject, null, 2)}`];
  }

  return [UNEXPECTED_ERROR];
}

type Props = {
  errors?: Array<string>;
  error?: Object|string;
  closeAction?: Function;
  sanitizeError?: (err: string) => string;
  className?: string;
}

/* eslint-disable react/no-array-index-key */

const ErrorAlerts = (props: Props) => {
  let errors = props.errors || parseError(props.error);

  if (props.sanitizeError) {
    errors = _.map(errors, props.sanitizeError);
  }

  if (errors && errors.length) {
    const className = classNames('fc-errors', props.className);
    return (
      <div className={className}>
        <AutoScroll />
        {errors.map((error, index) => {
          // $FlowFixMe: ternary operator flow, do you hear it ?
          const closeAction = props.closeAction ? () => props.closeAction(error, index) : null;

          return (
            <Alert
              key={`error-${error}-${index}`}
              type={Alert.ERROR}
              closeAction={closeAction}
            >
              {error}
            </Alert>
          );
        })}
      </div>
    );
  }

  return null;
};


export default ErrorAlerts;
