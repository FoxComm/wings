import React from 'react';
import Imgix from './imgix';

export default function createProductImage(imgixProductsSource, s3BucketName, s3BucketPrefix) {
  const s3PrefixRegExp = new RegExp(`https://.*/${s3BucketName}/${s3BucketPrefix}/(.*)`);

  // Use class component to be able to add 'ref' property outside
  return class ProductImage extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
      if (!imgixProductsSource) {
        return <img {...this.props} alt="" />;
      }

      const [, s3RelativeUrl] = this.props.src.match(s3PrefixRegExp);
      const imgixUrl = `${imgixProductsSource}/${s3RelativeUrl}`;

      return <Imgix {...this.props} src={imgixUrl} />;
    }
  };
}
