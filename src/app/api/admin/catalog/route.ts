import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/admin/auth";
import { readOnlyStore, withStore } from "@/lib/admin/store";
import {
  baseProducts,
  categoryNames,
  emptyCatalog,
  parsePatch,
  slugify,
  takenSlugs,
  uniqueSlug,
  type CatalogRecords,
} from "@/lib/catalog-records";

function catalogOf(store: { catalog?: CatalogRecords }) {
  return store.catalog ?? emptyCatalog();
}

function knownCategory(records: CatalogRecords, name: string) {
  return categoryNames(records).includes(name);
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const store = await readOnlyStore();
  return NextResponse.json({ ok: true, ...catalogOf(store) });
}

export async function PATCH(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await request.json().catch(() => null);
  const id = typeof body?.id === "string" ? body.id.trim() : "";
  if (!id || id.includes("..")) return NextResponse.json({ ok: false, error: "Нет товара" }, { status: 400 });
  const parsed = parsePatch(body);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  const patch = parsed.value;
  let error = "";
  const saved = await withStore(store => {
    const records = catalogOf(store);
    if (!knownCategory(records, patch.category)) {
      error = "Сначала добавьте категорию";
      return records;
    }
    const builtIn = baseProducts().some(product => product.id === id);
    const createdIndex = records.created.findIndex(product => product.id === id);
    if (builtIn) records.edits[id] = patch;
    else if (createdIndex >= 0) records.created[createdIndex] = { ...records.created[createdIndex], ...patch };
    else error = "Товар не найден";
    store.catalog = records;
    return records;
  });
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  return NextResponse.json({ ok: true, ...saved });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await request.json().catch(() => null);
  const action = typeof body?.action === "string" ? body.action : "product";

  if (action === "category") {
    const name = typeof body?.name === "string" ? body.name.trim().slice(0, 80) : "";
    if (name.length < 2) return NextResponse.json({ ok: false, error: "Укажите название категории" }, { status: 400 });
    let error = "";
    const saved = await withStore(store => {
      const records = catalogOf(store);
      if (categoryNames(records).some(item => item.toLocaleLowerCase("ru") === name.toLocaleLowerCase("ru"))) {
        error = "Такая категория уже есть";
        return records;
      }
      const slug = uniqueSlug(slugify(name), takenSlugs(records));
      records.categories.push({ name, slug });
      store.catalog = records;
      return records;
    });
    if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
    return NextResponse.json({ ok: true, ...saved });
  }

  if (action === "delete-category") {
    const slug = typeof body?.slug === "string" ? body.slug.trim() : "";
    let error = "";
    const saved = await withStore(store => {
      const records = catalogOf(store);
      const category = records.categories.find(item => item.slug === slug);
      if (!category) {
        error = "Эту категорию нельзя удалить";
        return records;
      }
      const used = records.created.some(product => product.category === category.name)
        || Object.values(records.edits).some(product => product.category === category.name);
      if (used) {
        error = "В категории есть товары";
        return records;
      }
      records.categories = records.categories.filter(item => item.slug !== slug);
      store.catalog = records;
      return records;
    });
    if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
    return NextResponse.json({ ok: true, ...saved });
  }

  const parsed = parsePatch(body);
  if (!parsed.ok) return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
  const patch = parsed.value;
  let error = "";
  const saved = await withStore(store => {
    const records = catalogOf(store);
    if (!knownCategory(records, patch.category)) {
      error = "Сначала добавьте категорию";
      return records;
    }
    const slug = uniqueSlug(slugify(patch.name), takenSlugs(records));
    records.created.push({ ...patch, id: slug, slug });
    store.catalog = records;
    return records;
  });
  if (error) return NextResponse.json({ ok: false, error }, { status: 400 });
  return NextResponse.json({ ok: true, ...saved });
}
