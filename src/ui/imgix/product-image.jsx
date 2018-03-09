/* @flow */

import React from 'react';
import Imgix from './imgix';

type Props = {
  imgixProductsSource: string,
  s3BucketName: string,
  s3BucketPrefix: string,
  src: string,
};

export default class ProductImage extends React.Component {
  props: Props;

  get s3PrefixRegExp(): RegExp {
    const { s3BucketPrefix } = this.props;
    if (s3BucketPrefix && s3BucketPrefix.length > 0) {
      return new RegExp(`https://.*/${this.props.s3BucketName}/${this.props.s3BucketPrefix}/(.*)`);
    }

    return new RegExp(`https://.*/${this.props.s3BucketName}/(.*)`);
  }

  render() {
    if (!this.props.src) {
      return null;
    }

    const { s3BucketName, s3BucketPrefix, imgixProductsSource, ...rest} = this.props;
    const matched = this.props.src.match(this.s3PrefixRegExp);

    if (!imgixProductsSource || !matched) {
      return <img alt="" {...rest} />;
    }

    const [, s3RelativeUrl] = matched;
    const imgixUrl = `${imgixProductsSource}/${s3RelativeUrl}`;

    return <Imgix {...this.props} src={imgixUrl} />;
  }
}
