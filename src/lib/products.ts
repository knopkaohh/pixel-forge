export type ProductVariant = {
  id: string;
  label: string;
  price: number;
  images: string[];
  wbUrl: string;
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
  comingSoon?: boolean;
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

function shots(folder: string, count: number) {
  return Array.from({ length: count }, (_, index) => `/images/products/${folder}/${index + 1}.jpg`);
}

function variant(id: string, label: string, price: number, folder: string, count: number, nm: number): ProductVariant {
  const images = shots(folder, count);
  return {
    id,
    label,
    price,
    images,
    wbUrl: `https://www.wildberries.ru/catalog/${nm}/detail.aspx`,
  };
}

export const products: CatalogProduct[] = [
  {
    id: "kover",
    slug: "kover-dzhutovyy",
    name: "Ковер джутовый",
    category: "Ковры",
    price: 2892,
    image: "/images/products/kover/80x120/1.jpg",
    images: shots("kover/80x120", 8),
    description: "Ковер из натурального джута ручной работы. Безворсовое плетение и живая фактура делают его тёплым акцентом в интерьере — особенно в стиле бохо, скандинавском или джапанди.\n\nИзносостойкий, подходит для гостиной, спальни, прихожей и террасы. Каждое изделие проходит через руки мастера: от первого витка до последнего стежка. Фотографии на странице относятся к выбранному размеру.",
    variantKind: "size",
    variants: [
      variant("80x120", "80×120 см", 3971, "kover/80x120", 8, 367153827),
      variant("80x150", "80×150 см", 5162, "kover/80x150", 6, 1139994991),
      variant("90x90", "90×90 см", 2892, "kover/90x90", 4, 367163313),
      variant("100x100", "100×100 см", 3479, "kover/100x100", 5, 367171769),
      variant("120x120", "120×120 см", 4766, "kover/120x120", 8, 367183187),
      variant("150x150", "150×150 см", 7666, "kover/150x150", 8, 465222124),
      variant("200x200", "200×200 см", 12619, "kover/200x200", 5, 1099926509),
    ],
    specs: { ...SHARED_SPECS, diameter: "90×90 см" },
  },
  {
    id: "kovrik",
    slug: "kovrik-dzhutovyy",
    name: "Коврик джутовый",
    category: "Ковры",
    price: 1742,
    image: "/images/products/kovrik/60x100/1.jpg",
    images: shots("kovrik/60x100", 5),
    description: "Экологичный коврик из натурального джута — для уютной и гармоничной атмосферы дома. Плетеная структура лаконично вписывается в любой стиль и добавляет интерьеру естественность.\n\nБезворсовая поверхность легко чистится и не собирает пыль, поэтому коврик удобен для семей с детьми и животными. В линейке круглые модели и овальные дорожки: фотографии меняются вместе с размером.",
    variantKind: "size",
    variants: [
      variant("60x100", "60×100 см", 2448, "kovrik/60x100", 5, 367215284),
      variant("80x80", "80×80 см", 2144, "kovrik/80x80", 4, 367204028),
      variant("100x100", "100×100 см", 3631, "kovrik/100x100", 8, 367195504),
      variant("60x60", "60×60 см", 1742, "kovrik/60x60", 3, 913792634),
      variant("50x70", "50×70 см", 1785, "kovrik/50x70", 4, 906040555),
    ],
    specs: { ...SHARED_SPECS, diameter: "60×100 см" },
  },
  {
    id: "salfetki",
    slug: "salfetki-servirovochnye",
    name: "Салфетки сервировочные",
    category: "Салфетки сервировочные",
    price: 1290,
    image: "/images/products/salfetki/2/1.jpg",
    images: shots("salfetki/2", 8),
    description: "Сервировочные салфетки-плейсматы из джута диаметром 35 см. Термостойкие, толщиной 8 мм — защитят стол от горячего, влаги и царапин.\n\nКруглые ажурные изделия ручной работы подходят для тарелок, сковород и горшочков и собирают сервировку в тёплом экостиле. В наборе 2 или 5 штук — для семьи и для гостей.",
    variantKind: "set",
    variants: [
      variant("2", "Набор 2 шт", 1290, "salfetki/2", 8, 367079668),
      variant("5", "Набор 5 шт", 2136, "salfetki/5", 7, 367093533),
    ],
    specs: { ...SHARED_SPECS, diameter: "35 см" },
  },
  {
    id: "podstavka",
    slug: "podstavka-pod-goryachee",
    name: "Подставка под горячее",
    category: "Подставка под горячее",
    price: 1089,
    image: "/images/products/podstavka/4/1.jpg",
    images: shots("podstavka/4", 4),
    description: "Подставки под горячее из джута, 20×20 см. В наборе 4 штуки — для чашек, кокотниц, чайника и подсвечников.\n\nТермостойкие, многоразовые, сделаны вручную на собственном производстве. Натуральный цвет джута сочетается с деревянной посудой и льняной скатертью.",
    variantKind: "set",
    variants: [
      variant("4", "Набор 4 шт", 1089, "podstavka/4", 4, 934817522),
    ],
    specs: { ...SHARED_SPECS, diameter: "20 см" },
  },
];

export const comingSoonItems: CatalogProduct[] = [
  {
    id: "korzina",
    slug: "korzina-dzhutovaya",
    name: "Корзина джутовая",
    category: "Корзины",
    price: 0,
    image: "/images/products/soon/korziny/1.jpg",
    images: shots("soon/korziny", 8),
    description: "Корзины из джутового каната ручной работы. Коллекция готовится к публикации.",
    variantKind: "size",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: "" },
    comingSoon: true,
  },
  {
    id: "kashpo",
    slug: "kashpo-dzhutovoe",
    name: "Кашпо из джута",
    category: "Кашпо",
    price: 0,
    image: "/images/products/soon/korziny/5.jpg",
    images: [
      "/images/products/soon/korziny/5.jpg",
      "/images/products/soon/korziny/6.jpg",
      "/images/products/soon/korziny/8.jpg",
    ],
    description: "Кашпо из натурального джута. Коллекция готовится к публикации.",
    variantKind: "size",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: "" },
    comingSoon: true,
  },
  {
    id: "panno",
    slug: "panno-dzhutovoe",
    name: "Панно из джута",
    category: "Панно",
    price: 0,
    image: "/images/products/soon/panno/1.jpg",
    images: ["/images/products/soon/panno/1.jpg"],
    description: "Настенное панно ручной работы. Коллекция готовится к публикации.",
    variantKind: "size",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: "" },
    comingSoon: true,
  },
  {
    id: "dekor",
    slug: "dekor-dzhutovyy",
    name: "Декор для стола",
    category: "Декор",
    price: 0,
    image: "/images/products/soon/dekor/1.jpg",
    images: shots("soon/dekor", 4),
    description: "Декор из джута для сервировки. Коллекция готовится к публикации.",
    variantKind: "size",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: "" },
    comingSoon: true,
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
  { name: "Ковры", image: "/images/products/kover/80x120/1.jpg", href: "/catalog?category=Ковры", soon: false },
  { name: "Салфетки сервировочные", image: "/images/products/salfetki/2/1.jpg", href: "/catalog?category=Салфетки сервировочные", soon: false },
  { name: "Подставка под горячее", image: "/images/products/podstavka/4/1.jpg", href: "/catalog?category=Подставка под горячее", soon: false },
  { name: "Корзины", image: "/images/products/soon/korziny/1.jpg", href: "/catalog?category=Корзины", soon: true },
  { name: "Кашпо", image: "/images/products/soon/korziny/5.jpg", href: "/catalog?category=Кашпо", soon: true },
  { name: "Панно", image: "/images/products/soon/panno/1.jpg", href: "/catalog?category=Панно", soon: true },
  { name: "Декор", image: "/images/products/soon/dekor/1.jpg", href: "/catalog?category=Декор", soon: true },
];

export function getProduct(slug: string) {
  return products.find(product => product.slug === slug) ?? comingSoonItems.find(product => product.slug === slug);
}

export function minPrice(product: CatalogProduct) {
  if (!product.variants.length) return product.price;
  return Math.min(...product.variants.map(item => item.price));
}

export function toCartItem(product: CatalogProduct, variantItem = product.variants[0]): CartProduct {
  const chosen = variantItem ?? product.variants[0];
  return {
    id: chosen ? `${product.id}__${chosen.id}` : product.id,
    name: chosen && product.variants.length > 1 ? `${product.name}, ${chosen.label}` : product.name,
    price: chosen?.price ?? product.price,
    image: chosen?.images[0] ?? product.image,
  };
}

export function specRows(product: CatalogProduct, variantItem?: ProductVariant) {
  const diameter = product.variantKind === "size" && variantItem ? variantItem.label : (product.specs.diameter || "—");
  return [
    ["Материал", product.specs.material],
    ["Диаметр", diameter],
    ["Толщина", product.specs.thickness],
    ["Цвет", product.specs.color],
    ["Производство", product.specs.production],
    ["Уход", product.specs.care],
  ] as const;
}
