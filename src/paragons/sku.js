// @flow

// returns unique in terms of cart/order key for sku line item
export function skuIdentity(sku: Object): string {
  return sku.referenceNumbers[0] || sku.sku;
}
