/* @flow */

type MaybeString = string|void;

// deprecated, use (api-js).creditCards.cardType instead
export function detectCardType(cardNumber: MaybeString): MaybeString {
  if (cardNumber == void 0) return;

  if (/^3[47]/.test(cardNumber)) {
    return 'American Express';
  } else if (/^30[0-5]/.test(cardNumber) || /^3[68]/.test(cardNumber)) {
    return 'Diners Club';
  } else if (/^5[1-5]/.test(cardNumber)) {
    return 'Mastercard';
  } else if (/^4/.test(cardNumber)) {
    return 'Visa';
  }
}

// cardType values can be found here https://stripe.com/docs/stripe.js?#card-cardType
export function cardMask(cardType: MaybeString): string {
  switch (cardType) {
    case 'American Express':
      return '9999 999999 99999';
    case 'Diners Club':
      return '9999 999999 9999';
    default:
      return '9999 9999 9999 9999';
  }
}

export function cvvLength(cardType: MaybeString): number {
  if (cardType == 'American Express') {
    return 4;
  }
  return 3;
}

export function trimWhiteSpace(cardNumber: string): string {
  return cardNumber.replace(/\s/g, '');
}

// deprecated, use (api-js).creditCards.validateCardNumber instead
export function isCardNumberValid(cardNumber: string): boolean {
  const mask = cardMask(detectCardType(cardNumber)).replace(/[^\d]/g, '');

  return mask.length === trimWhiteSpace(cardNumber).length;
}

export function isCvvValid(cvv: string, cardType: string): boolean {
  return cvv.length == cvvLength(cardType)
}
