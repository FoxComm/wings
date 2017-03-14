/* @flow */

import _ from 'lodash';
import classNames from 'classnames';
import React from 'react';
import Alert from './alert';
import AutoScroll from '../common/auto-scroll';

function parseError(err) {
  if (!err) return null;

  return _.get(err, ['responseJson', 'errors'], [err.toString()]);
}

type Props = {
  errors?: Array<string>;
  error?: Object|string;
  closeAction?: Function;
  sanitizeError?: (err: string) => string;
  className?: string;
}

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
              closeAction={closeAction}>
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
