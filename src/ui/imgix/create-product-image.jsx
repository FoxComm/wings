import React from 'react';

import ProductImage from './product-image';

export default function createProductImage(imgixProductsSource, s3BucketName, s3BucketPrefix) {
  // Use class component to be able to add 'ref' property outside
  return class ProductImageWrapper extends React.Component { // eslint-disable-line react/prefer-stateless-function
    render() {
      return (<ProductImage
        imgixProductsSource={imgixProductsSource}
        s3BucketName={s3BucketName}
        s3BucketPrefixs={s3BucketPrefix}
        {...this.props}
      />);
    }
  };
}
