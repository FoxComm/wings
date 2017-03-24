import React from 'react';
import Imgix from './imgix';

export default function createProductImage(imgixProductsSource, s3BucketName, s3BucketPrefix) {
  const s3PrefixRegExp = new RegExp(`https://.*/${s3BucketName}/${s3BucketPrefix}/(.*)`);

  // Use class component to be able to add 'ref' property outside
  return class ProductImage extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
      if (!this.props.src) {
        return null;
      }

      const matched = this.props.src.match(s3PrefixRegExp);

      if (!imgixProductsSource || !matched) {
        return <img {...this.props} alt="" />;
      }

      const [, s3RelativeUrl] = matched;
      const imgixUrl = `${imgixProductsSource}/${s3RelativeUrl}`;

      return <Imgix {...this.props} src={imgixUrl} />;
    }
  };
}
