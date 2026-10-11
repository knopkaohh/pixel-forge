/** Ozon acquiring payment links. Paste a URL after the SKU is registered in Ozon. */
export const ozonPayUrls: Record<string, string> = {
  "kover-50x70": "",
  "kover-60": "",
  "kover-60x100": "",
  "kover-80x120": "",
  "kover-80x150": "",
  "kover-90": "",
  "kover-100": "",
  "kover-120": "",
  "kover-150": "",
  "kover-200": "",
  "salfetki-2": "",
  "salfetki-5": "",
  "podstavka-20": "",
};

export function catalogIdFromCartId(id: string) {
  return id.split("__")[0];
}

export function payUrlFor(cartOrProductId: string) {
  return ozonPayUrls[catalogIdFromCartId(cartOrProductId)] ?? "";
}

export type PayableItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  payUrl?: string;
};

export type PaymentUnit = {
  key: string;
  name: string;
  price: number;
  image: string;
  payUrl: string;
  unitIndex: number;
  unitCount: number;
};

export function paymentUnits(items: PayableItem[]): PaymentUnit[] {
  return items.flatMap(item => {
    const payUrl = item.payUrl || payUrlFor(item.id);
    const count = Math.max(1, item.quantity);
    return Array.from({ length: count }, (_, index) => ({
      key: `${item.id}-${index}`,
      name: item.name,
      price: item.price,
      image: item.image,
      payUrl,
      unitIndex: index + 1,
      unitCount: count,
    }));
  });
}
