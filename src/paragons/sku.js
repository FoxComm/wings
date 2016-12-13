// @flow

import _ from 'lodash';

// returns unique in terms of cart/order key for sku line item
export function skuIdentity(sku: Object): string {
  return _.get(sku, ['referenceNumbers', 0]) || sku.sku;
}
