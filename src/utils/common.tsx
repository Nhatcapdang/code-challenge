interface FormatNumberOptions {
  value?: number;
  digit?: number;
  offsetRate?: number;
  toFixed?: boolean;
  failoverValue?: string;
}

export function formatNumber({
  value,
  digit = 0,
  offsetRate,
  toFixed,
  failoverValue = '0',
}: FormatNumberOptions): string {
  if (typeof value === 'string') {
    value = Number(value);
  }
  console.log('value', value);
  if (value == null || isNaN(value)) return failoverValue;

  let num = offsetRate ? value / offsetRate : value;
  const isNegative = num < 0;

  num = Math.abs(num);

  // Round to specified digits
  const rounded = Number(Math.round(Number(`${num}e+${digit}`)) + `e-${digit}`);

  // Format the number
  let [intPart, fractionPart = ''] = toFixed
    ? rounded.toFixed(digit).split('.')
    : rounded.toString().split('.');

  intPart = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');

  const result =
    intPart + (fractionPart && digit > 0 ? `.${fractionPart}` : '');

  return (isNegative ? '-' : '') + result;
}
