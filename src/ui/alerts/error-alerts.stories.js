import React from 'react';
import { storiesOf } from '@kadira/storybook';
import ErrorAlerts from './error-alerts';

storiesOf('ui.ErrorAlerts', module)
  .add('base', () => <ErrorAlerts error="Something went wrong"/>)
  .add('responseJson error', () => (
    <ErrorAlerts error={{responseJson: {code: 'ETIMEDOUT'}}}/>
  ))