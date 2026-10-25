import {
  categories as baseCategories,
  categoryFromSlug,
  categorySlugs,
  comingSoonItems,
  products,
  type CatalogProduct,
} from "@/lib/products";

export type CatalogSpecs = CatalogProduct["specs"];

export type CatalogPatch = {
  name: string;
  price: number;
  description: string;
  category: string;
  images: string[];
  specs: CatalogSpecs;
  sizeLabel: string;
  comingSoon: boolean;
  featured: boolean;
  onOrder: boolean;
};

export type CreatedProductRecord = CatalogPatch & {
  id: string;
  slug: string;
};

export type ExtraCategory = {
  name: string;
  slug: string;
};

export type CatalogRecords = {
  edits: Record<string, CatalogPatch>;
  created: CreatedProductRecord[];
  categories: ExtraCategory[];
  deleted: string[];
};

export type EditableProduct = CreatedProductRecord & {
  builtIn: boolean;
};

export type LiveCategory = {
  name: string;
  image: string;
  href: string;
  soon: boolean;
};

const SPEC_KEYS = ["material", "diameter", "thickness", "color", "production", "care"] as const;

const LETTERS: Record<string, string> = {
  а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh", з: "z", и: "i", й: "y",
  к: "k", л: "l", м: "m", н: "n", о: "o", п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f",
  х: "h", ц: "ts", ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya",
};

export function emptyCatalog(): CatalogRecords {
  return { edits: {}, created: [], categories: [], deleted: [] };
}

export function slugify(value: string) {
  let out = "";
  for (const char of value.toLowerCase()) {
    if (LETTERS[char]) out += LETTERS[char];
    else if (/[a-z0-9]/.test(char)) out += char;
    else out += "-";
  }
  const slug = out.replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 60);
  return slug || "tovar";
}

export function uniqueSlug(base: string, taken: Set<string>) {
  const root = base || "tovar";
  let slug = root;
  let index = 2;
  while (taken.has(slug)) slug = `${root}-${index++}`;
  return slug;
}

function cleanText(value: unknown, max: number) {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

export function cleanImages(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .filter((item): item is string => typeof item === "string")
    .map(item => item.trim())
    .filter(item => item.startsWith("/uploads/") || item.startsWith("/images/") || item.startsWith("https://"))
    .filter(item => !item.includes("..") && !item.includes("\\"))
    .slice(0, 12);
}

export function cleanSpecs(value: unknown): CatalogSpecs {
  const source = value && typeof value === "object" ? value as Record<string, unknown> : {};
  return {
    material: cleanText(source.material, 200),
    diameter: cleanText(source.diameter, 200),
    thickness: cleanText(source.thickness, 200),
    color: cleanText(source.color, 200),
    production: cleanText(source.production, 200),
    care: cleanText(source.care, 200),
  };
}

export function parsePatch(body: unknown): { ok: true; value: CatalogPatch } | { ok: false; error: string } {
  const source = body && typeof body === "object" ? body as Record<string, unknown> : {};
  const name = cleanText(source.name, 160);
  if (!name) return { ok: false, error: "Укажите название" };
  const price = typeof source.price === "number" ? source.price : Number(source.price);
  if (!Number.isFinite(price) || price < 0 || price > 10_000_000) return { ok: false, error: "Укажите цену" };
  const images = cleanImages(source.images);
  if (!images.length) return { ok: false, error: "Добавьте хотя бы одно фото" };
  const category = cleanText(source.category, 80);
  if (!category) return { ok: false, error: "Выберите категорию" };
  const specs = cleanSpecs(source.specs);
  for (const key of SPEC_KEYS) {
    if (!specs[key] && key !== "diameter") specs[key] = key === "material" ? "джут" : "";
  }
  return {
    ok: true,
    value: {
      name,
      price: Math.round(price),
      description: cleanText(source.description, 8000),
      category,
      images,
      specs,
      sizeLabel: cleanText(source.sizeLabel, 80),
      comingSoon: source.comingSoon === true,
      featured: source.featured === true,
      onOrder: source.onOrder === true,
    },
  };
}

export function normalizeCatalog(value: unknown): CatalogRecords {
  const source = value && typeof value === "object" ? value as Partial<CatalogRecords> : {};
  const edits: Record<string, CatalogPatch> = {};
  if (source.edits && typeof source.edits === "object" && !Array.isArray(source.edits)) {
    for (const [id, patch] of Object.entries(source.edits)) {
      const parsed = parsePatch(patch);
      if (parsed.ok && id && !id.includes("..")) edits[id] = parsed.value;
    }
  }
  const created: CreatedProductRecord[] = [];
  if (Array.isArray(source.created)) {
    for (const item of source.created) {
      if (!item || typeof item !== "object") continue;
      const record = item as Partial<CreatedProductRecord>;
      const parsed = parsePatch(record);
      const id = cleanText(record.id, 80);
      const slug = cleanText(record.slug, 80);
      if (!parsed.ok || !id || !slug || id.includes("..") || slug.includes("..")) continue;
      created.push({ ...parsed.value, id, slug });
    }
  }
  const categories: ExtraCategory[] = [];
  if (Array.isArray(source.categories)) {
    for (const item of source.categories) {
      if (!item || typeof item !== "object") continue;
      const record = item as Partial<ExtraCategory>;
      const name = cleanText(record.name, 80);
      const slug = cleanText(record.slug, 80);
      if (!name || !slug || slug.includes("..")) continue;
      categories.push({ name, slug });
    }
  }
  const deleted: string[] = [];
  if (Array.isArray(source.deleted)) {
    for (const item of source.deleted) {
      const id = cleanText(item, 80);
      if (id && !id.includes("..") && !deleted.includes(id)) deleted.push(id);
    }
  }
  return { edits, created, categories, deleted };
}

function applyPatch(product: CatalogProduct, patch?: CatalogPatch): CatalogProduct {
  if (!patch) return product;
  return {
    ...product,
    name: patch.name,
    price: patch.price,
    description: patch.description,
    category: patch.category,
    sizeLabel: patch.sizeLabel,
    comingSoon: patch.comingSoon,
    featured: patch.featured,
    onOrder: patch.onOrder,
    specs: { ...product.specs, ...patch.specs },
    images: patch.images,
    image: patch.images[0] || product.image,
  };
}

function fromCreated(item: CreatedProductRecord): CatalogProduct {
  return {
    id: item.id,
    slug: item.slug,
    sku: item.slug,
    family: item.id,
    name: item.name,
    sizeLabel: item.sizeLabel,
    category: item.category,
    price: item.price,
    image: item.images[0],
    images: item.images,
    description: item.description,
    variantKind: "size",
    variants: [],
    specs: item.specs,
    reviews: [],
    featured: item.featured,
    comingSoon: item.comingSoon,
    onOrder: item.onOrder,
  };
}

export function baseProducts() {
  return [...products, ...comingSoonItems];
}

export function mergeCatalog(records: CatalogRecords) {
  const catalog = normalizeCatalog(records);
  const removed = new Set(catalog.deleted);
  const all = [
    ...baseProducts().map(product => applyPatch(product, catalog.edits[product.id])),
    ...catalog.created.map(fromCreated),
  ].filter(product => !removed.has(product.id));
  const sale = all.filter(product => !product.comingSoon);
  const featured = sale.filter(product => product.featured);
  const slugByName = new Map<string, string>(Object.entries(categorySlugs));
  for (const category of catalog.categories) slugByName.set(category.name, category.slug);
  const names: string[] = baseCategories.map(category => category.name);
  for (const category of catalog.categories) {
    if (!names.includes(category.name)) names.push(category.name);
  }
  for (const product of all) {
    if (product.category && !names.includes(product.category)) names.push(product.category);
  }
  for (const name of names) {
    if (!slugByName.has(name)) slugByName.set(name, slugify(name));
  }
  const liveCategories: LiveCategory[] = names.map(name => {
    const items = all.filter(product => product.category === name);
    const builtIn = baseCategories.find(category => category.name === name);
    const slug = slugByName.get(name) || slugify(name);
    const soon = items.length ? items.every(product => product.comingSoon) : Boolean(builtIn?.soon);
    return {
      name,
      image: builtIn?.image || items[0]?.image || "/images/categories/kovry.jpg",
      href: `/catalog/${slug}`,
      soon,
    };
  });
  const editable: EditableProduct[] = all.map(product => ({
    id: product.id,
    slug: product.slug,
    name: product.name,
    price: product.price,
    description: product.description,
    category: product.category,
    images: product.images.length ? product.images : [product.image],
    specs: product.specs,
    sizeLabel: product.sizeLabel,
    comingSoon: Boolean(product.comingSoon),
    featured: Boolean(product.featured),
    onOrder: Boolean(product.onOrder),
    builtIn: baseProducts().some(item => item.id === product.id),
  }));
  return {
    all,
    sale,
    featured,
    categories: liveCategories,
    tabs: ["Все", ...liveCategories.map(category => category.name)],
    editable,
    slugFor(name: string) {
      if (name === "Все") return "";
      return slugByName.get(name) || "";
    },
    nameForSlug(slug: string) {
      const extra = catalog.categories.find(category => category.slug === slug);
      if (extra) return extra.name;
      return categoryFromSlug(slug);
    },
    productBySlug(slug: string) {
      return all.find(product => product.slug === slug || product.id === slug);
    },
  };
}

export function takenSlugs(records: CatalogRecords) {
  const taken = new Set<string>();
  for (const product of baseProducts()) {
    taken.add(product.id);
    taken.add(product.slug);
  }
  for (const slug of Object.values(categorySlugs)) taken.add(slug);
  for (const product of records.created) {
    taken.add(product.id);
    taken.add(product.slug);
  }
  for (const category of records.categories) taken.add(category.slug);
  return taken;
}

export function categoryNames(records: CatalogRecords) {
  return mergeCatalog(records).categories.map(category => category.name);
}
