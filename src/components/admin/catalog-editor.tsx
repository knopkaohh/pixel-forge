"use client";

import { useEffect, useMemo, useState } from "react";
import { emptyCatalog, mergeCatalog, normalizeCatalog, type CatalogRecords, type EditableProduct } from "@/lib/catalog-records";

const specFields: [keyof EditableProduct["specs"], string][] = [
  ["material", "Материал"],
  ["diameter", "Диаметр"],
  ["thickness", "Толщина"],
  ["color", "Цвет"],
  ["production", "Производство"],
  ["care", "Уход"],
];

function blankProduct(category: string): EditableProduct {
  return {
    id: "",
    slug: "",
    name: "",
    category,
    price: 0,
    description: "",
    images: [],
    specs: {
      material: "джут",
      diameter: "",
      thickness: "8 мм",
      color: "натуральный",
      production: "Россия, ручная работа",
      care: "Сухая чистка",
    },
    sizeLabel: "",
    comingSoon: false,
    featured: false,
    onOrder: false,
    builtIn: false,
  };
}

async function api(url: string, init?: RequestInit) {
  const response = await fetch(url, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers || {}) },
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Ошибка запроса");
  return data;
}

export function CatalogEditor() {
  const [records, setRecords] = useState<CatalogRecords>(emptyCatalog());
  const [ready, setReady] = useState(false);
  const [draft, setDraft] = useState<EditableProduct | null>(null);
  const [creating, setCreating] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const live = useMemo(() => mergeCatalog(records), [records]);

  useEffect(() => {
    api("/api/admin/catalog")
      .then(data => setRecords(normalizeCatalog(data)))
      .catch(err => setError(err instanceof Error ? err.message : "Не удалось открыть каталог"))
      .finally(() => setReady(true));
  }, []);

  function applyRecords(data: CatalogRecords) {
    const next = normalizeCatalog(data);
    setRecords(next);
    return next;
  }

  function openProduct(item: EditableProduct) {
    setCreating(false);
    setError("");
    setMessage("");
    setDraft({ ...item, specs: { ...item.specs }, images: [...item.images] });
  }

  function startProduct() {
    setCreating(true);
    setError("");
    setMessage("");
    setDraft(blankProduct(live.categories.find(category => !category.soon)?.name || "Ковры"));
  }

  async function addPhotos(files: FileList | null) {
    if (!files?.length || !draft) return;
    setBusy(true);
    setError("");
    try {
      const urls: string[] = [];
      for (const file of Array.from(files).slice(0, 12 - draft.images.length)) {
        const body = new FormData();
        body.append("file", file);
        const response = await fetch("/api/admin/upload", { method: "POST", body });
        const data = await response.json().catch(() => ({}));
        if (!response.ok) throw new Error(data.error || "Не удалось загрузить фото");
        urls.push(data.url);
      }
      setDraft(current => current ? { ...current, images: [...current.images, ...urls].slice(0, 12) } : current);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось загрузить фото");
    } finally {
      setBusy(false);
    }
  }

  async function saveProduct() {
    if (!draft) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const payload = {
        id: draft.id,
        name: draft.name,
        price: draft.price,
        description: draft.description,
        category: draft.category,
        images: draft.images,
        specs: draft.specs,
        sizeLabel: draft.sizeLabel,
        comingSoon: draft.comingSoon,
        featured: draft.featured,
        onOrder: draft.onOrder,
      };
      const data = creating
        ? await api("/api/admin/catalog", { method: "POST", body: JSON.stringify({ action: "product", ...payload }) })
        : await api("/api/admin/catalog", { method: "PATCH", body: JSON.stringify(payload) });
      const next = applyRecords(data);
      const saved = creating
        ? mergeCatalog(next).editable.at(-1)
        : mergeCatalog(next).editable.find(item => item.id === draft.id);
      if (saved) openProduct(saved);
      setCreating(false);
      setMessage("Сохранено. На сайте карточка обновится после обновления страницы.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось сохранить");
    } finally {
      setBusy(false);
    }
  }

  async function addCategory() {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const data = await api("/api/admin/catalog", { method: "POST", body: JSON.stringify({ action: "category", name: categoryName }) });
      applyRecords(data);
      setCategoryName("");
      setMessage("Категория добавлена. Она появится в каталоге на сайте.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось добавить категорию");
    } finally {
      setBusy(false);
    }
  }

  async function removeCategory(slug: string) {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const data = await api("/api/admin/catalog", { method: "POST", body: JSON.stringify({ action: "delete-category", slug }) });
      applyRecords(data);
      setMessage("Категория удалена.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить категорию");
    } finally {
      setBusy(false);
    }
  }

  async function deleteProduct() {
    if (!draft || creating) return;
    if (!window.confirm(`Удалить «${draft.name}»? Товар пропадёт с сайта.`)) return;
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const data = await api("/api/admin/catalog", { method: "POST", body: JSON.stringify({ action: "delete-product", id: draft.id }) });
      applyRecords(data);
      setDraft(null);
      setMessage("Товар удалён.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Не удалось удалить товар");
    } finally {
      setBusy(false);
    }
  }

  if (!ready) return <p className="admin-empty">Открываем карточки…</p>;

  return (
    <div className="admin-catalog">
      <div className="admin-catalog-bar">
        <form onSubmit={event => { event.preventDefault(); addCategory(); }}>
          <input value={categoryName} onChange={event => setCategoryName(event.target.value)} placeholder="Новая категория" />
          <button type="submit" disabled={busy || categoryName.trim().length < 2}>Добавить категорию</button>
        </form>
        <button type="button" onClick={startProduct} disabled={busy}>Новый товар</button>
      </div>
      {records.categories.length > 0 && (
        <div className="admin-category-list">
          {records.categories.map(category => (
            <span key={category.slug}>{category.name}<button type="button" onClick={() => removeCategory(category.slug)} aria-label={`Удалить категорию ${category.name}`}>×</button></span>
          ))}
        </div>
      )}
      {error && <p className="error">{error}</p>}
      {message && <p className="admin-note">{message}</p>}
      <div className="admin-product-grid">
        {live.editable.map(item => (
          <button type="button" key={item.id} className={draft?.id === item.id && !creating ? "active" : ""} onClick={() => openProduct(item)}>
            <img src={item.images[0]} alt="" />
            <b>{item.name}</b>
            <span>Артикул {item.slug}</span>
            <span>{item.category}{item.comingSoon ? " · скоро" : ""}{item.onOrder ? " · под заказ" : ""}</span>
            <strong>{item.price ? `${item.price.toLocaleString("ru-RU")} ₽` : "—"}</strong>
          </button>
        ))}
      </div>
      {draft && (
        <form className="admin-editor" onSubmit={event => { event.preventDefault(); saveProduct(); }}>
          <h3>{creating ? "Новый товар" : draft.name}</h3>
          {!creating && draft.slug && <p className="admin-note">Артикул {draft.slug}. Клиент его не видит, в заказе он сохраняется.</p>}
          <div className="admin-photos">
            {draft.images.map((src, index) => (
              <figure key={`${src}-${index}`}>
                <img src={src} alt="" />
                <button type="button" onClick={() => setDraft({ ...draft, images: draft.images.filter((_, imageIndex) => imageIndex !== index) })} aria-label="Убрать фото">×</button>
              </figure>
            ))}
            <label className="admin-upload">
              Добавить фото
              <input type="file" accept="image/jpeg,image/png,image/webp" multiple onChange={event => { addPhotos(event.target.files); event.target.value = ""; }} />
            </label>
          </div>
          <label>Название<input value={draft.name} onChange={event => setDraft({ ...draft, name: event.target.value })} /></label>
          <div className="admin-spec-grid">
            <label>Цена, ₽<input type="number" min="0" value={draft.price} onChange={event => setDraft({ ...draft, price: Number(event.target.value) })} /></label>
            <label>Категория
              <select value={draft.category} onChange={event => setDraft({ ...draft, category: event.target.value })}>
                {live.categories.map(category => <option key={category.name} value={category.name}>{category.name}</option>)}
              </select>
            </label>
            <label>Размер на карточке<input value={draft.sizeLabel} onChange={event => setDraft({ ...draft, sizeLabel: event.target.value })} placeholder="60 см или набор 2 шт" /></label>
          </div>
          <div className="admin-spec-grid">
            {specFields.map(([key, label]) => (
              <label key={key}>{label}<input value={draft.specs[key]} onChange={event => setDraft({ ...draft, specs: { ...draft.specs, [key]: event.target.value } })} /></label>
            ))}
          </div>
          <label>Описание<textarea value={draft.description} onChange={event => setDraft({ ...draft, description: event.target.value })} /></label>
          <label className="admin-check"><input type="checkbox" checked={draft.featured} onChange={event => setDraft({ ...draft, featured: event.target.checked })} />Показывать в «Популярных товарах»</label>
          <label className="admin-check"><input type="checkbox" checked={draft.comingSoon} onChange={event => setDraft({ ...draft, comingSoon: event.target.checked })} />Пока не продаётся</label>
          <div className="admin-stock">
            <label className="admin-check"><input type="radio" name="stock" checked={!draft.onOrder} onChange={() => setDraft({ ...draft, onOrder: false })} />В наличии</label>
            <label className="admin-check"><input type="radio" name="stock" checked={draft.onOrder} onChange={() => setDraft({ ...draft, onOrder: true })} />Под заказ</label>
          </div>
          <div className="admin-actions">
            <button type="submit" disabled={busy}>{creating ? "Добавить товар" : "Сохранить"}</button>
            {!creating && <button type="button" className="danger" disabled={busy} onClick={deleteProduct}>Удалить товар</button>}
            <button type="button" className="ghost" onClick={() => { setDraft(null); setCreating(false); }}>Закрыть</button>
          </div>
        </form>
      )}
    </div>
  );
}
