import { payUrlFor } from "@/lib/payments";

export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  images: string[];
  wbUrl: string;
};

export type ProductReview = {
  author: string;
  rating: number;
  date: string;
  text: string;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  sku: string;
  family: string;
  name: string;
  sizeLabel: string;
  category: string;
  price: number;
  image: string;
  images: string[];
  description: string;
  variantKind: "size" | "set";
  variants: ProductVariant[];
  specs: {
    material: string;
    diameter: string;
    thickness: string;
    color: string;
    production: string;
    care: string;
  };
  reviews: ProductReview[];
  wbUrl?: string;
  featured?: boolean;
  comingSoon?: boolean;
};

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
  sku?: string;
  option?: string;
  payUrl?: string;
};

const RUG_SPECS = {
  material: "натуральный джут",
  thickness: "8 мм",
  color: "натуральный",
  production: "Россия, Ульяновская область",
  care: "Влажная чистка намыленной губкой. Сухая чистка. Можно пылесосить. Стирать запрещено.",
} as const;

const TABLE_SPECS = {
  material: "натуральный джут",
  thickness: "8 мм",
  color: "натуральный",
  production: "Россия, Ульяновская область",
  care: "Влажная чистка намыленной губкой. Сухая чистка. Стирать запрещено.",
} as const;

function shots(folder: string, count: number) {
  return Array.from({ length: count }, (_, index) => `/images/products/${folder}/${index + 1}.jpg`);
}

const RUG_DESCRIPTION = "Безворсовый ковер из натурального джута, ручной работы. Отшивается из джутового каната шириной 8 мм, на швейной машине, строчкой зигзаг, прочными нитями. Плетеная фактура делает его теплым акцентом в интерьере – особенно в стиле бохо, скандинавском и джапанди.\n\nКовер обладает высокой износостойкостью, низкой теплопроводностью, подходит для теплых полов и влажных помещений. Фотографии на странице относятся к выбранному размеру.";

const PLACEMAT_DESCRIPTION = "Набор джутовых плейсматов, ручной работы. Выполнены из джутового каната, прошиты строчкой зигзаг. При заказе учтите толщину 8 мм. Термостойкие и подходят как подставка под горячую посуду, сковородки и горшочки, для украшения и сервировки стола под тарелки. Создают уютную атмосферу на кухне и в столовой.";

function rug(opts: {
  sku: string;
  name: string;
  sizeLabel: string;
  price: number;
  count: number;
  featured?: boolean;
}): CatalogProduct {
  const images = shots(opts.sku, opts.count);
  return {
    id: opts.sku,
    slug: opts.sku,
    sku: opts.sku,
    family: opts.sku,
    name: opts.name,
    sizeLabel: opts.sizeLabel,
    category: "Ковры",
    price: opts.price,
    image: images[0],
    images,
    description: RUG_DESCRIPTION,
    variantKind: "size",
    variants: [],
    specs: { ...RUG_SPECS, diameter: opts.sizeLabel },
    reviews: [],
    featured: opts.featured,
  };
}

export const products: CatalogProduct[] = [
  rug({ sku: "w002", name: "Ковёр круглый 100 см", sizeLabel: "100 см", price: 3479, count: 6, featured: true }),
  rug({ sku: "w003", name: "Ковёр круглый 100 см", sizeLabel: "100 см", price: 3479, count: 8, featured: true }),
  rug({ sku: "w005", name: "Ковёр овальный 60×100 см", sizeLabel: "60×100 см", price: 2448, count: 6 }),
  rug({ sku: "w006", name: "Ковёр круглый 90 см", sizeLabel: "90 см", price: 2892, count: 4 }),
  rug({ sku: "w007", name: "Ковёр круглый 120 см", sizeLabel: "120 см", price: 4766, count: 6 }),
  rug({ sku: "w008", name: "Ковёр овальный 80×120 см", sizeLabel: "80×120 см", price: 3971, count: 7, featured: true }),
  rug({ sku: "w012", name: "Ковёр круглый 60 см", sizeLabel: "60 см", price: 1742, count: 5, featured: true }),
  rug({ sku: "w013", name: "Ковёр овальный 50×70 см", sizeLabel: "50×70 см", price: 1785, count: 5, featured: true }),
  rug({ sku: "w014", name: "Ковёр круглый 150 см", sizeLabel: "150 см", price: 7666, count: 7, featured: true }),
  rug({ sku: "w017", name: "Ковёр овальный 80×150 см", sizeLabel: "80×150 см", price: 5162, count: 6 }),
  rug({ sku: "w018", name: "Ковёр круглый 200 см", sizeLabel: "200 см", price: 12619, count: 7 }),
  {
    id: "w011",
    slug: "w011",
    sku: "w011",
    family: "w011",
    name: "Набор сервировочных салфеток, 2 шт",
    sizeLabel: "2 шт, 35×35 см",
    category: "Сервировка стола",
    price: 1290,
    image: "/images/products/w011/1.jpg",
    images: shots("w011", 4),
    description: `Комплект: 2 шт 35×35 см.\n\n${PLACEMAT_DESCRIPTION}`,
    variantKind: "set",
    variants: [],
    specs: { ...TABLE_SPECS, diameter: "2 шт, 35×35 см" },
    reviews: [],
    featured: true,
  },
  {
    id: "w010",
    slug: "w010",
    sku: "w010",
    family: "w010",
    name: "Набор сервировочных салфеток, 4+1",
    sizeLabel: "4 шт 35×35 см и 1 шт 20×20 см",
    category: "Сервировка стола",
    price: 2136,
    image: "/images/products/w010/1.jpg",
    images: shots("w010", 5),
    description: `Комплект: 4 шт 35×35 см и 1 шт 20×20 см.\n\n${PLACEMAT_DESCRIPTION}`,
    variantKind: "set",
    variants: [],
    specs: { ...TABLE_SPECS, diameter: "4 шт 35×35 см и 1 шт 20×20 см" },
    reviews: [],
  },
];

export const comingSoonItems: CatalogProduct[] = [];

export const catalogTabs = [
  "Все",
  "Ковры",
  "Сервировка стола",
  "Кашпо и корзины",
  "Освещение",
  "Панно",
] as const;

export const comingSoonCategories = ["Кашпо и корзины", "Освещение", "Панно"] as const;

export const categorySlugs = {
  "Ковры": "kovry",
  "Сервировка стола": "servirovka",
  "Кашпо и корзины": "kashpo-i-korziny",
  "Освещение": "osveshchenie",
  "Панно": "panno",
} as const;

export function categoryPath(name: string) {
  const slug = categorySlugs[name as keyof typeof categorySlugs];
  return slug ? `/catalog/${slug}` : "/catalog";
}

export function categoryFromSlug(slug: string) {
  return (Object.entries(categorySlugs).find(([, value]) => value === slug)?.[0] ?? "") as string;
}

export const categories = [
  { name: "Ковры", image: "/images/categories/kovry.jpg", href: categoryPath("Ковры"), soon: false },
  { name: "Сервировка стола", image: "/images/categories/salfetki.jpg", href: categoryPath("Сервировка стола"), soon: false },
  { name: "Кашпо и корзины", image: "/images/categories/korziny.jpg", href: categoryPath("Кашпо и корзины"), soon: true },
  { name: "Освещение", image: "/images/categories/osveshchenie.jpg", href: categoryPath("Освещение"), soon: true },
  { name: "Панно", image: "/images/categories/panno.jpg", href: categoryPath("Панно"), soon: true },
];

const SLUG_ALIASES: Record<string, string> = {
  "kover-dzhutovyy": "w008",
  "kovrik-dzhutovyy": "w005",
  "salfetki-servirovochnye": "w011",
  "kover-50x70": "w013",
  "kover-60": "w012",
  "kover-60x100": "w005",
  "kover-80x120": "w008",
  "kover-80x150": "w017",
  "kover-90": "w006",
  "kover-100": "w002",
  "kover-120": "w007",
  "kover-150": "w014",
  "kover-200": "w018",
  "salfetki-2": "w011",
  "salfetki-5": "w010",
};

export function resolveProductSlug(slug: string) {
  return SLUG_ALIASES[slug] ?? slug;
}

export function getProduct(slug: string) {
  const resolved = resolveProductSlug(slug);
  return products.find(product => product.slug === resolved) ?? comingSoonItems.find(product => product.slug === resolved);
}

export const BACKING_PRICE = 200;

export function toCartItem(product: CatalogProduct, variantItem?: ProductVariant, backing = false): CartProduct {
  const chosen = variantItem ?? product.variants[0];
  const baseId = chosen ? `${product.id}__${chosen.id}` : product.id;
  const id = backing ? `${baseId}__latex` : baseId;
  return {
    id,
    name: chosen && product.variants.length > 1 ? `${product.name}, ${chosen.label}` : product.name,
    sku: product.sku,
    option: backing ? "Антискользящее покрытие" : undefined,
    price: (chosen?.price ?? product.price) + (backing ? BACKING_PRICE : 0),
    image: chosen?.images[0] ?? product.image,
    payUrl: payUrlFor(id),
  };
}

export function familyProducts(product: CatalogProduct) {
  return products.filter(item => item.family === product.family);
}

export function minPrice(product: CatalogProduct) {
  if (!product.variants.length) return product.price;
  return Math.min(...product.variants.map(item => item.price));
}

export function productSizeCm(product: CatalogProduct) {
  const fromSpec = [...(product.specs.diameter || "").matchAll(/(\d+)/g)].map(match => Number(match[1]));
  if (fromSpec.length) return Math.max(...fromSpec);
  const fromLabel = [...(product.sizeLabel || "").matchAll(/(\d+)/g)].map(match => Number(match[1]));
  return fromLabel.length ? Math.max(...fromLabel) : 0;
}

export const SIZE_FILTERS = [
  { id: "to60", label: "до 60 см", match: (cm: number) => cm > 0 && cm <= 60 },
  { id: "60-100", label: "60–100 см", match: (cm: number) => cm > 60 && cm <= 100 },
  { id: "100-150", label: "100–150 см", match: (cm: number) => cm > 100 && cm <= 150 },
  { id: "over150", label: "более 150 см", match: (cm: number) => cm > 150 },
] as const;

export function specRows(product: CatalogProduct, variantItem?: ProductVariant) {
  const diameter = variantItem?.label || product.sizeLabel || product.specs.diameter || "—";
  return [
    ["Материал", product.specs.material],
    ["Размер", diameter],
    ["Толщина", product.specs.thickness],
    ["Цвет", product.specs.color],
    ["Производство", product.specs.production],
    ["Уход", product.specs.care],
  ] as const;
}

export const featuredProducts = products.filter(product => product.featured);
