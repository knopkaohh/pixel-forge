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

const RUG_REVIEWS: ProductReview[] = [
  { author: "Дарья", rating: 5, date: "17 сентября 2026", text: "Ковер понравился, запах есть, но надеемся за ночь на улице уйдёт. Тяжёлый, плотный, хорошо упакован, скручен в рулон и быстро расправился. Переживала, что будут заломы, но нет — всё ок." },
  { author: "Ольга", rating: 5, date: "16 сентября 2026", text: "Товар очень понравился, спасибо за труд и красоту. На веранде стало уютно. Именно такой ковёр из джута и искала." },
  { author: "Марина", rating: 5, date: "10 сентября 2026", text: "Необыкновенный коврик. Пропарила заломы — и он ровненький. Спасибо за ваш труд и радость, которую несёте людям." },
  { author: "Екатерина", rating: 5, date: "5 сентября 2026", text: "Ковёр супер. К интерьеру в тёплом природном стиле подошёл идеально." },
  { author: "Ирина", rating: 5, date: "18 августа 2026", text: "Очень понравился. Много лет лежала плетёная циновка, со временем начала крошиться — джут оказался прочнее. Семья довольна." },
  { author: "Елена", rating: 5, date: "30 августа 2026", text: "Замечательный коврик. Качество на высоте, приятно ходить." },
  { author: "Наталья", rating: 5, date: "7 октября 2026", text: "Упаковка хорошая, качество и вид понравились. Есть лёгкий запах натурального джута, но не критично. Если нужен эффект больше — берите размер с запасом." },
  { author: "Марина", rating: 5, date: "18 сентября 2026", text: "Мэри Джут, вы лучшие. С огромной благодарностью за ваш труд и красоту." },
];

const MAT_REVIEWS: ProductReview[] = [
  { author: "Валерия", rating: 5, date: "5 сентября 2026", text: "Идеальный коврик, отлично вписался в интерьер, не мнётся, можно пылесосить без проблем." },
  { author: "Нина", rating: 5, date: "7 сентября 2026", text: "Замечательный коврик. Очень довольна работой команды Мэри Джут — просто поднимаете настроение." },
  { author: "Ираида", rating: 5, date: "31 августа 2026", text: "Ждала этот коврик с нетерпением. Подходит по стилю к деревянному дому. Доставка быстрая, упакован очень качественно и с заботой о покупателе." },
  { author: "Марина", rating: 5, date: "8 августа 2026", text: "Коврик просто потрясающий, один в один как хотела. Добротный, тяжёленький, приятный и красивый. Отдельное спасибо за аккуратную упаковку." },
  { author: "Мария", rating: 5, date: "31 июля 2026", text: "10 из 10: с трудом заворачивается и гнётся, не будет постоянно задираться. Долговечный и очень красивый." },
  { author: "Екатерина", rating: 5, date: "31 августа 2026", text: "Очень понравился, для душевой подошёл идеально." },
  { author: "Танзиля", rating: 5, date: "3 октября 2026", text: "Прекрасно смотрится, всё соответствует описанию, качество на высоте." },
];

const TABLE_REVIEWS: ProductReview[] = [
  { author: "Алла", rating: 5, date: "3 сентября 2026", text: "Очень милые уютные салфетки, упаковано с любовью, спасибо продавцу." },
  { author: "Любовь", rating: 5, date: "15 мая 2026", text: "Просто супер подставки. Стол выглядит с ними очень красиво." },
  { author: "Ольга", rating: 5, date: "2 мая 2026", text: "Замечательные салфетки. Спасибо за очередную красоту в доме." },
  { author: "Татьяна", rating: 5, date: "29 августа 2026", text: "Очень дорого смотрится. Для большого стола — то, что нужно." },
  { author: "Марина", rating: 5, date: "17 июля 2026", text: "Украшают комнату, функциональные. Спасибо за ваш труд." },
  { author: "Ольга", rating: 5, date: "16 сентября 2026", text: "Маленькие и уютные. Приобретение порадовало." },
  { author: "Ольга", rating: 5, date: "10 мая 2026", text: "Спасибо всем, кто приложил руку к такой красоте." },
];

const RUG_DESCRIPTION = "Ковер из натурального джута ручной работы. Безворсовое плетение и живая фактура делают его тёплым акцентом в интерьере — особенно в стиле бохо, скандинавском или джапанди.\n\nИзносостойкий, подходит для гостиной, спальни, прихожей и террасы. Каждое изделие проходит через руки мастера: от первого витка до последнего стежка. Фотографии на странице относятся к выбранному размеру.";

function rug(opts: {
  id: string;
  sizeId: string;
  sizeLabel: string;
  price: number;
  count: number;
  nm: number;
  featured?: boolean;
  reviews?: ProductReview[];
}): CatalogProduct {
  const images = shots(`kover/${opts.sizeId}`, opts.count);
  return {
    id: opts.id,
    slug: opts.id,
    family: "kover",
    name: `Ковер джутовый ${opts.sizeLabel}`,
    sizeLabel: opts.sizeLabel,
    category: "Ковры",
    price: opts.price,
    image: images[0],
    images,
    description: RUG_DESCRIPTION,
    variantKind: "size",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: opts.sizeLabel },
    reviews: opts.reviews ?? RUG_REVIEWS,
    wbUrl: `https://www.wildberries.ru/catalog/${opts.nm}/detail.aspx`,
    featured: opts.featured,
  };
}

export const products: CatalogProduct[] = [
  rug({ id: "kover-50x70", sizeId: "50x70", sizeLabel: "50×70 см", price: 1785, count: 12, nm: 906040555, featured: true, reviews: MAT_REVIEWS }),
  rug({ id: "kover-60", sizeId: "60", sizeLabel: "60 см", price: 1742, count: 8, nm: 913792634, featured: true, reviews: MAT_REVIEWS }),
  rug({ id: "kover-60x100", sizeId: "60x100", sizeLabel: "60×100 см", price: 2448, count: 8, nm: 367215284, reviews: MAT_REVIEWS }),
  rug({ id: "kover-80x120", sizeId: "80x120", sizeLabel: "80×120 см", price: 3971, count: 11, nm: 367153827, featured: true }),
  rug({ id: "kover-80x150", sizeId: "80x150", sizeLabel: "80×150 см", price: 5162, count: 5, nm: 1139994991 }),
  rug({ id: "kover-90", sizeId: "90", sizeLabel: "90 см", price: 2892, count: 5, nm: 367163313 }),
  rug({ id: "kover-100", sizeId: "100", sizeLabel: "100 см", price: 3479, count: 6, nm: 367171769, featured: true }),
  rug({ id: "kover-120", sizeId: "120", sizeLabel: "120 см", price: 4766, count: 6, nm: 367183187 }),
  rug({ id: "kover-150", sizeId: "150", sizeLabel: "150 см", price: 7666, count: 4, nm: 465222124, featured: true }),
  rug({ id: "kover-200", sizeId: "200", sizeLabel: "200 см", price: 12619, count: 6, nm: 1099926509, featured: true }),
  {
    id: "salfetki-2",
    slug: "salfetki-2",
    family: "salfetki",
    name: "Салфетки сервировочные, набор 2 шт",
    sizeLabel: "Набор 2 шт",
    category: "Салфетки сервировочные",
    price: 1290,
    image: "/images/products/salfetki/2/1.jpg",
    images: shots("salfetki/2", 5),
    description: "Сервировочные салфетки-плейсматы из джута диаметром 35 см. Термостойкие, толщиной 8 мм — защитят стол от горячего, влаги и царапин.\n\nКруглые ажурные изделия ручной работы подходят для тарелок, сковород и горшочков и собирают сервировку в тёплом экостиле. В этом наборе 2 штуки.",
    variantKind: "set",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: "35 см" },
    reviews: TABLE_REVIEWS,
    wbUrl: "https://www.wildberries.ru/catalog/367079668/detail.aspx",
    featured: true,
  },
  {
    id: "salfetki-5",
    slug: "salfetki-5",
    family: "salfetki",
    name: "Салфетки сервировочные, набор 5 шт",
    sizeLabel: "Набор 5 шт",
    category: "Салфетки сервировочные",
    price: 2136,
    image: "/images/products/salfetki/5/1.jpg",
    images: shots("salfetki/5", 5),
    description: "Сервировочные салфетки-плейсматы из джута диаметром 35 см. Термостойкие, толщиной 8 мм — защитят стол от горячего, влаги и царапин.\n\nКруглые ажурные изделия ручной работы подходят для тарелок, сковород и горшочков. В этом наборе 5 штук — для семьи и для гостей.",
    variantKind: "set",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: "35 см" },
    reviews: TABLE_REVIEWS,
    wbUrl: "https://www.wildberries.ru/catalog/367093533/detail.aspx",
  },
  {
    id: "podstavka-20",
    slug: "podstavka-20",
    family: "podstavka",
    name: "Подставка под горячее, 20×20 см",
    sizeLabel: "20×20 см",
    category: "Подставка под горячее",
    price: 1089,
    image: "/images/products/podstavka/20/1.jpg",
    images: shots("podstavka/20", 4),
    description: "Подставки под горячее из джута, 20×20 см. В наборе 4 штуки — для чашек, кокотниц, чайника и подсвечников.\n\nТермостойкие, многоразовые, сделаны вручную на собственном производстве. Натуральный цвет джута сочетается с деревянной посудой и льняной скатертью.",
    variantKind: "set",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: "20 см" },
    reviews: TABLE_REVIEWS,
    wbUrl: "https://www.wildberries.ru/catalog/934817522/detail.aspx",
    featured: true,
  },
];

export const comingSoonItems: CatalogProduct[] = [
  {
    id: "korzina",
    slug: "korzina-dzhutovaya",
    family: "korzina",
    name: "Корзина джутовая",
    sizeLabel: "",
    category: "Корзины",
    price: 0,
    image: "/images/products/soon/korziny/1.jpg",
    images: shots("soon/korziny", 8),
    description: "Корзины из джутового каната ручной работы. Коллекция готовится к публикации.",
    variantKind: "size",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: "" },
    reviews: [],
    comingSoon: true,
  },
  {
    id: "kashpo",
    slug: "kashpo-dzhutovoe",
    family: "kashpo",
    name: "Кашпо из джута",
    sizeLabel: "",
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
    reviews: [],
    comingSoon: true,
  },
  {
    id: "panno",
    slug: "panno-dzhutovoe",
    family: "panno",
    name: "Панно из джута",
    sizeLabel: "",
    category: "Панно",
    price: 0,
    image: "/images/products/soon/panno/1.jpg",
    images: ["/images/products/soon/panno/1.jpg"],
    description: "Настенное панно ручной работы. Коллекция готовится к публикации.",
    variantKind: "size",
    variants: [],
    specs: { ...SHARED_SPECS, diameter: "" },
    reviews: [],
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
] as const;

export const comingSoonCategories = ["Корзины", "Кашпо", "Панно"] as const;

export const categories = [
  { name: "Ковры", image: "/images/categories/kovry.jpg", href: "/catalog?category=Ковры", soon: false },
  { name: "Салфетки сервировочные", image: "/images/categories/salfetki.jpg", href: "/catalog?category=Салфетки сервировочные", soon: false },
  { name: "Подставка под горячее", image: "/images/categories/podstavki.jpg", href: "/catalog?category=Подставка под горячее", soon: false },
  { name: "Корзины", image: "/images/basket.png", href: "/catalog?category=Корзины", soon: true },
  { name: "Кашпо", image: "/images/basket.png", href: "/catalog?category=Кашпо", soon: true },
  { name: "Панно", image: "/images/wall-art.png", href: "/catalog?category=Панно", soon: true },
];

const SLUG_ALIASES: Record<string, string> = {
  "kover-dzhutovyy": "kover-80x120",
  "kovrik-dzhutovyy": "kover-60x100",
  "salfetki-servirovochnye": "salfetki-2",
  "podstavka-pod-goryachee": "podstavka-20",
};

export function resolveProductSlug(slug: string) {
  return SLUG_ALIASES[slug] ?? slug;
}

export function getProduct(slug: string) {
  const resolved = resolveProductSlug(slug);
  return products.find(product => product.slug === resolved) ?? comingSoonItems.find(product => product.slug === resolved);
}

export function familyProducts(product: CatalogProduct) {
  return products.filter(item => item.family === product.family);
}

export function minPrice(product: CatalogProduct) {
  if (!product.variants.length) return product.price;
  return Math.min(...product.variants.map(item => item.price));
}

export function toCartItem(product: CatalogProduct, variantItem?: ProductVariant): CartProduct {
  const chosen = variantItem ?? product.variants[0];
  return {
    id: chosen ? `${product.id}__${chosen.id}` : product.id,
    name: chosen && product.variants.length > 1 ? `${product.name}, ${chosen.label}` : product.name,
    price: chosen?.price ?? product.price,
    image: chosen?.images[0] ?? product.image,
  };
}

export function specRows(product: CatalogProduct, variantItem?: ProductVariant) {
  const diameter = variantItem?.label || product.sizeLabel || product.specs.diameter || "—";
  return [
    ["Материал", product.specs.material],
    ["Диаметр", diameter],
    ["Толщина", product.specs.thickness],
    ["Цвет", product.specs.color],
    ["Производство", product.specs.production],
    ["Уход", product.specs.care],
  ] as const;
}

export const featuredProducts = products.filter(product => product.featured);
