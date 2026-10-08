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
  reviews: ProductReview[];
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
    reviews: RUG_REVIEWS,
  },
  {
    id: "kovrik",
    slug: "kovrik-dzhutovyy",
    name: "Коврик джутовый",
    category: "Ковры",
    price: 1742,
    image: "/images/products/kovrik/100x100/1.jpg",
    images: shots("kovrik/100x100", 8),
    description: "Экологичный коврик из натурального джута — для уютной и гармоничной атмосферы дома. Плетеная структура лаконично вписывается в любой стиль и добавляет интерьеру естественность.\n\nБезворсовая поверхность легко чистится и не собирает пыль, поэтому коврик удобен для семей с детьми и животными. В линейке круглые модели и овальные дорожки: фотографии меняются вместе с размером.",
    variantKind: "size",
    variants: [
      variant("60x100", "60×100 см", 2448, "kovrik/60x100", 5, 367215284),
      variant("80x80", "80×80 см", 2144, "kovrik/80x80", 4, 367204028),
      variant("100x100", "100×100 см", 3631, "kovrik/100x100", 8, 367195504),
      variant("60x60", "60×60 см", 1742, "kovrik/60x60", 3, 913792634),
      variant("50x70", "50×70 см", 1785, "kovrik/50x70", 3, 906040555),
    ],
    specs: { ...SHARED_SPECS, diameter: "60×100 см" },
    reviews: MAT_REVIEWS,
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
    reviews: TABLE_REVIEWS,
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
    reviews: TABLE_REVIEWS,
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
    reviews: [],
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
    reviews: [],
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
  { name: "Ковры", image: "/images/products/kover/80x120/1.jpg", href: "/catalog?category=Ковры", soon: false },
  { name: "Салфетки сервировочные", image: "/images/products/salfetki/2/1.jpg", href: "/catalog?category=Салфетки сервировочные", soon: false },
  { name: "Подставка под горячее", image: "/images/products/podstavka/4/1.jpg", href: "/catalog?category=Подставка под горячее", soon: false },
  { name: "Корзины", image: "/images/products/soon/korziny/1.jpg", href: "/catalog?category=Корзины", soon: true },
  { name: "Кашпо", image: "/images/products/soon/korziny/5.jpg", href: "/catalog?category=Кашпо", soon: true },
  { name: "Панно", image: "/images/products/soon/panno/1.jpg", href: "/catalog?category=Панно", soon: true },
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
