export type ProductVariant = {
  id: string;
  label: string;
  price: number;
};

export type CatalogProduct = {
  id: string;
  slug: string;
  name: string;
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
};

export type CartProduct = {
  id: string;
  name: string;
  price: number;
  image: string;
};

const SHARED_SPECS = {
  material: "джут",
  thickness: "8 мм",
  color: "натуральный",
  production: "Россия, ручная работа",
  care: "Сухая чистка",
} as const;

function gallery(folder: string, count: number) {
  return Array.from({ length: count }, (_, index) => `/images/products/${folder}/${index + 1}.webp`);
}

export const products: CatalogProduct[] = [
  {
    id: "kover",
    slug: "kover-dzhutovyy",
    name: "Ковер джутовый",
    category: "Ковры",
    price: 2892,
    image: "/images/products/kover/1.webp",
    images: gallery("kover", 8),
    description: "Ковер из натурального джута ручной работы. Безворсовое плетение, толщина 8 мм.",
    variantKind: "size",
    variants: [
      { id: "80x120", label: "80×120 см", price: 3971 },
      { id: "80x150", label: "80×150 см", price: 5162 },
      { id: "90x90", label: "90×90 см", price: 2892 },
      { id: "100x100", label: "100×100 см", price: 3479 },
      { id: "120x120", label: "120×120 см", price: 4766 },
      { id: "150x150", label: "150×150 см", price: 7666 },
      { id: "200x200", label: "200×200 см", price: 12619 },
    ],
    specs: { ...SHARED_SPECS, diameter: "90×90 см" },
  },
  {
    id: "kovrik",
    slug: "kovrik-dzhutovyy",
    name: "Коврик джутовый",
    category: "Ковры",
    price: 1742,
    image: "/images/products/kovrik/1.webp",
    images: gallery("kovrik", 8),
    description: "Коврик из натурального джута ручной работы. Безворсовое плетение, толщина 8 мм.",
    variantKind: "size",
    variants: [
      { id: "60x100", label: "60×100 см", price: 2448 },
      { id: "80x80", label: "80×80 см", price: 2144 },
      { id: "100x100", label: "100×100 см", price: 3631 },
      { id: "60x60", label: "60×60 см", price: 1742 },
      { id: "50x70", label: "50×70 см", price: 1785 },
    ],
    specs: { ...SHARED_SPECS, diameter: "60×100 см" },
  },
  {
    id: "salfetki",
    slug: "salfetki-servirovochnye",
    name: "Салфетки сервировочные",
    category: "Салфетки сервировочные",
    price: 1290,
    image: "/images/products/salfetki/1.webp",
    images: gallery("salfetki", 8),
    description: "Сервировочные салфетки из джута, 35×35 см. Термостойкие, ручная работа.",
    variantKind: "set",
    variants: [
      { id: "2", label: "Набор 2 шт", price: 1290 },
      { id: "5", label: "Набор 5 шт", price: 2136 },
    ],
    specs: { ...SHARED_SPECS, diameter: "35 см" },
  },
  {
    id: "podstavka",
    slug: "podstavka-pod-goryachee",
    name: "Подставка под горячее",
    category: "Подставка под горячее",
    price: 1089,
    image: "/images/products/podstavka/1.webp",
    images: gallery("podstavka", 8),
    description: "Подставка под горячее из джута, 20×20 см. Набор 4 шт, ручная работа.",
    variantKind: "set",
    variants: [
      { id: "4", label: "Набор 4 шт", price: 1089 },
    ],
    specs: { ...SHARED_SPECS, diameter: "20 см" },
  },
];

export const catalogTabs = [
  "Все",
  "Ковры",
  "Салфетки сервировочные",
  "Подставка под горячее",
  "Корзины",
  "Кашпо",
  "Панно",
  "Декор",
] as const;

export const comingSoonCategories = ["Корзины", "Кашпо", "Панно", "Декор"] as const;

export const categories = [
  { name: "Ковры", image: "/images/products/kover/1.webp", href: "/catalog?category=Ковры", soon: false },
  { name: "Салфетки сервировочные", image: "/images/products/salfetki/1.webp", href: "/catalog?category=Салфетки сервировочные", soon: false },
  { name: "Подставка под горячее", image: "/images/products/podstavka/1.webp", href: "/catalog?category=Подставка под горячее", soon: false },
  { name: "Корзины", image: "/images/basket.png", href: "/catalog?category=Корзины", soon: true },
  { name: "Кашпо", image: "/images/basket.png", href: "/catalog?category=Кашпо", soon: true },
  { name: "Панно", image: "/images/wall-art.png", href: "/catalog?category=Панно", soon: true },
  { name: "Декор", image: "/images/hero-dining.png", href: "/catalog?category=Декор", soon: true },
];

export function getProduct(slug: string) {
  return products.find(product => product.slug === slug);
}

export function minPrice(product: CatalogProduct) {
  return Math.min(...product.variants.map(variant => variant.price));
}

export function toCartItem(product: CatalogProduct, variant = product.variants[0]): CartProduct {
  return {
    id: `${product.id}__${variant.id}`,
    name: product.variants.length > 1 ? `${product.name}, ${variant.label}` : product.name,
    price: variant.price,
    image: product.image,
  };
}

export function specRows(product: CatalogProduct, variant: ProductVariant) {
  const diameter = product.variantKind === "size" ? variant.label : product.specs.diameter;
  return [
    ["Материал", product.specs.material],
    ["Диаметр", diameter],
    ["Толщина", product.specs.thickness],
    ["Цвет", product.specs.color],
    ["Производство", product.specs.production],
    ["Уход", product.specs.care],
  ] as const;
}
