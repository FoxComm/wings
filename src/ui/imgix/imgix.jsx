/* eslint-disable max-len, react/prefer-stateless-function */

import React from 'react';
import Imgix from 'react-imgix';

export default class ImgixResponsiveWrapper extends React.Component {
  render() {
    const settings = {
      auto: ['compress', 'format'],
      fit: 'clip',
      faces: false,
      src: this.props.src,
    };

    const imgProps = this.props;
    const width = this.props.width || 'defaultWidth';
    const height = this.props.height;

    return (
      <Imgix
        src={this.props.src}
        type="picture"
        imgProps={imgProps}
        {...settings}
      >
        {/* See css/media-queries.css */}
        {/* Ordering media queries from highest to lowest is matter here */}
        <Imgix width={width} {...settings} height={height || 800} type="source" imgProps={{media: '(min-width: 90.063em)'}} />
        <Imgix width={width} {...settings} height={height || 600} type="source" imgProps={{media: '(min-width: 64em)'}} />
        <Imgix width={width} {...settings} height={height || 500} type="source" imgProps={{media: '(min-width: 48em)'}} />
        <Imgix width={width} {...settings} height={height || 300} type="source" imgProps={{media: '(max-width: 47.9375em)'}} />
      </Imgix>
    );
  }
}
