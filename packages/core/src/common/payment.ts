export enum PaymentCurrency {
  USD = 'USD',
  EUR = 'EUR',
  UAH = 'UAH',
}

export const CURRENCY_TO_TOKEN_EXCHANGE_RATE = [
  {
    name: PaymentCurrency.USD,
    symbol: '$',
    tokenRate: 5,
  },
  {
    name: PaymentCurrency.EUR,
    symbol: '€',
    tokenRate: 5.43,
  },
  {
    name: PaymentCurrency.UAH,
    symbol: '₴',
    tokenRate: 0.13512,
  },
];

export const calculateTokensFromPrice = (price: number, tokenRate: number) => {
  const res = Math.round(price * tokenRate);
  return Number.isNaN(res) ? 0 : res;
};
