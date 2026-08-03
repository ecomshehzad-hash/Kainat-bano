export interface Coupon {
  code: string;
  type: "percent" | "flat";
  value: number;
  description: string;
}

export const COUPONS: Coupon[] = [
  { code: "WELCOME10", type: "percent", value: 10, description: "10% off your first order" },
  { code: "KAINAT20", type: "percent", value: 20, description: "20% off orders over $200" },
  { code: "FREESHIP", type: "flat", value: 15, description: "$15 off shipping" },
];

export function validateCoupon(code: string): Coupon | null {
  return COUPONS.find((c) => c.code.toLowerCase() === code.trim().toLowerCase()) || null;
}
