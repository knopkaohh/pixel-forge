"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  Heart,
  Leaf,
  Mail,
  Menu,
  MessageCircle,
  Phone,
  Minus,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Truck,
  UserRound,
  WalletCards,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useShop } from "@/components/shop-provider";
import { useLiveCatalog } from "@/components/catalog-provider";
import {
  BACKING_PRICE,
  minPrice,
  productSizeCm,
  products,
  SIZE_FILTERS,
  specRows,
  toCartItem,
  type CatalogProduct,
} from "@/lib/products";
import { PHONE_DISPLAY, PHONE_HREF } from "@/lib/contacts";
import { CONTACT_EMAIL, CONTACT_MAILTO } from "@/lib/site";
import { isCompleteRuPhone } from "@/lib/phone";
import { portfolioPhotos, socialLinks } from "@/lib/portfolio";
import { PhoneInput } from "@/components/phone-input";

const JUTE_PRICE_PER_METER = 65;
const formatPrice = (price: number) => `${price.toLocaleString("ru-RU")} ₽`;


function Logo() {
  return (
    <Link href="/" className="brand" aria-label="Мэри Джут — главная">
      <svg className="brand-leaf" viewBox="0 0 42 42" aria-hidden="true">
        <path d="M35.5 6.5C20 7 9.2 14 8.1 27.8c7.7 1.7 15.5-.5 20.2-6.9 3.6-4.8 4.8-10 7.2-14.4Z" />
        <path d="M7 35c3.7-10.2 10.8-17.6 22.8-23.3M17.2 22.1c-.2-3.2.4-6 1.7-8.7M18.6 21.1c3.2.4 6.4-.1 9.5-1.5" />
      </svg>
      <span className="brand-copy"><b>Мэри Джут</b><small>изделия из джута</small></span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const { cartCount, favorites } = useShop();
  const nav = [
    ["Каталог", "/catalog"],
    ["О нас", "/about"],
    ["Доставка", "/delivery"],
    ["Оплата", "/payment"],
    ["Контакты", "/contacts"],
  ];
  const moreNav = [
    ["Акции", "/promotions"],
    ["Возврат и обмен", "/returns"],
    ["Гарантия качества", "/warranty"],
    ["Уход за изделиями", "/care"],
    ["Вопросы и ответы", "/faq"],
    ["Сертификаты", "/certificates"],
    ["Портфолио", "/portfolio"],
    ["Личный кабинет", "/account"],
    ["Политика конфиденциальности", "/privacy"],
    ["Пользовательское соглашение", "/terms"],
  ];

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
    <div className="topbar">
      <div className="announcement">Бесплатная доставка при заказе от 15 000 ₽ до 30 октября</div>
      <header className="site-header">
        <div className="shell header-inner">
          <Logo />
          <nav className="desktop-nav">
            {nav.map(([label, href]) => (
              <Link key={label} href={href}>{label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <a className="phone" href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            <Link className="header-icon fav" href="/favorites" aria-label="Избранное"><Heart />{favorites.length > 0 && <i>{favorites.length}</i>}</Link>
            <Link className="header-icon" href="/account" aria-label="Личный кабинет"><UserRound /></Link>
            <Link className="header-icon bag" href="/cart" aria-label="Корзина"><ShoppingBag />{cartCount > 0 && <i>{cartCount}</i>}</Link>
            <a className="header-icon phone-link" href={PHONE_HREF} aria-label="Позвонить"><Phone /></a>
            <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Открыть меню"><Menu /></button>
          </div>
        </div>
      </header>
    </div>
      {open && (
        <div className="menu-overlay" onClick={() => setOpen(false)}>
          <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Меню сайта" onClick={event => event.stopPropagation()}>
            <div className="drawer-head"><Logo /><button onClick={() => setOpen(false)} aria-label="Закрыть меню"><X /></button></div>
            <div className="drawer-columns">
              <nav><span>Основное</span>{nav.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}<ArrowRight /></Link>)}<Link href="/favorites" onClick={() => setOpen(false)}>Избранное<ArrowRight /></Link><Link href="/cart" onClick={() => setOpen(false)}>Корзина<ArrowRight /></Link></nav>
              <nav><span>Покупателям</span>{moreNav.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}<ArrowRight /></Link>)}</nav>
            </div>
            <div className="drawer-contact"><span>Нужна помощь с выбором?</span><a href={PHONE_HREF}>{PHONE_DISPLAY}</a><Link href="/contacts" onClick={() => setOpen(false)}>Написать нам</Link></div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  const live = useLiveCatalog();

  return (
    <footer className="footer" id="contacts">
      <div className="shell footer-grid">
        <div className="footer-brand">
          <Logo />
          <p>Интерьерные изделия из натурального джута.<br />Собственное производство с душой — в России.</p>
          <div className="socials">{socialLinks.map(item => <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer" aria-label={item.name}>{item.label}</a>)}</div>
          <div className="footer-contact">
            <a href={PHONE_HREF}>{PHONE_DISPLAY}</a>
            <a href={CONTACT_MAILTO}>{CONTACT_EMAIL}</a>
            <p>пн–пт, 10:00–19:00 (МСК)<br />Россия, г. Ульяновск, ул. Карла Либкнехта, д. 5</p>
          </div>
        </div>
        <div><h4>Каталог</h4>{live.categories.map(cat => <Link key={cat.name} href={cat.href}>{cat.name}</Link>)}</div>
        <div><h4>О компании</h4><Link href="/about">О нас</Link><Link href="/portfolio">Портфолио</Link><Link href="/contacts">Контакты</Link><Link href="/faq">Вопросы и ответы</Link><Link href="/certificates">Сертификаты</Link></div>
        <div><h4>Покупателям</h4><Link href="/delivery">Доставка</Link><Link href="/payment">Оплата</Link><Link href="/returns">Возврат</Link><Link href="/warranty">Гарантия</Link><Link href="/care">Уход за изделиями</Link><Link href="/promotions">Акции</Link><Link href="/calculator">Свой размер</Link></div>
        <div><h4>Документы</h4><Link href="/privacy">Политика конфиденциальности</Link><Link href="/terms">Пользовательское соглашение</Link></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 Мэри Джут</span><span><Link href="/privacy">Политика конфиденциальности</Link> · <Link href="/terms">Пользовательское соглашение</Link></span></div>
    </footer>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

function SectionTitle({ children, link }: { children: React.ReactNode; link?: string }) {
  return <div className="section-heading"><h2>{children}</h2>{link && <Link href={link}>Смотреть все <ArrowRight /></Link>}</div>;
}

function ProductCard({ product = products[0] }: { product?: CatalogProduct }) {
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const [added, setAdded] = useState(false);
  const liked = isFavorite(product.id);
  const href = `/product/${product.slug}`;
  const price = minPrice(product);
  const soon = Boolean(product.comingSoon);
  return (
    <article className={`product-card${soon ? " soon" : ""}`}>
      <Link href={href} className="product-image">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" unoptimized />
        {soon && <span className="product-badge">Скоро</span>}
      </Link>
      <button className={`heart ${liked ? "active" : ""}`} onClick={() => toggleFavorite({ id: product.id, name: product.name, price, image: product.image })} aria-label="Добавить в избранное" aria-pressed={liked}><Heart /></button>
      <div className="product-copy">
        <Link href={href}><h3>{product.name}</h3></Link>
        {product.sku && <small className="product-sku">Артикул {product.sku}</small>}
        <p>{soon ? "Коллекция готовится к публикации" : "Натуральный джут · в наличии"}</p>
        <div className="product-bottom">
          {soon ? <strong>Скоро в каталоге</strong> : <strong>{formatPrice(price)}</strong>}
          {!soon && <button onClick={() => { addToCart(toCartItem(product)); setAdded(true); }}><span>{added ? "Добавлено" : "В корзину"}</span><ShoppingBag /></button>}
        </div>
      </div>
    </article>
  );
}

function Benefits() {
  return (
    <div className="benefits shell">
      <div><Leaf /><span><b>Ручная работа</b>Сделано с душой</span></div>
      <div><Sparkles /><span><b>Собственное производство</b>В России</span></div>
      <div><PackageCheck /><span><b>Натуральные материалы</b>100% джут</span></div>
      <div><Truck /><span><b>Доставка по всей России</b>Озон и СДЭК</span></div>
    </div>
  );
}

export function HomePage() {
  const live = useLiveCatalog();
  const [homeFaqOpen, setHomeFaqOpen] = useState<number | null>(null);
  const homeFaqs = [
    ["Как ухаживать за изделиями?", "Используйте сухую чистку мягкой щёткой или пылесосом на небольшой мощности. Не замачивайте изделие полностью."],
    ["Можно ли заказать свой размер?", "Да. Укажите форму и размеры в калькуляторе, а мастер уточнит детали и подтвердит итоговую стоимость."],
    ["Почему новое изделие имеет запах?", "Это естественный аромат натурального джута. После проветривания он становится значительно слабее в течение нескольких дней."],
  ];

  return (
    <Page>
      <section className="hero">
        <div className="hero-slides">
          <picture className="active curtain">
            <source media="(max-width: 900px)" srcSet="/images/hero/slide-1-mobile.jpg" />
            <img src="/images/hero/slide-1-desktop.jpg" alt="Светлый интерьер с джутовым ковром" />
          </picture>
        </div>
        <div className="hero-content">
          <p className="hero-draft">Сайт в разработке</p>
          <p className="hero-kicker"><i /><span>Натуральные материалы<br />для уютного дома</span></p>
          <h1>Природный<br />уют в вашем<br />доме</h1>
          <span>Ковры, корзины, панно и декор ручной работы из натурального джута</span>
          <Button className="hero-cta" render={<Link href="/catalog" />}>Перейти в каталог <ArrowRight /></Button>
        </div>
        <div className="hero-index" aria-hidden="true">
          <span className="active"><i />01</span>
          <span>02</span>
          <span>03</span>
        </div>
      </section>
      <Benefits />
      <section className="shell section">
        <SectionTitle link="/catalog">Популярные товары</SectionTitle>
        <div className="product-grid">{live.featured.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>
      <section className="shell story-banner">
        <Image src="/images/hero.png" alt="" fill sizes="100vw" />
        <div className="story-copy"><em>Ковры</em><p>Индивидуальное изготовление</p><span>Если вы не нашли подходящий ковёр, вы можете сделать заказ по вашим размерам.</span><Button render={<Link href="/calculator" />}>Рассчитать стоимость <ArrowRight /></Button></div>
      </section>
      <section className="shell section">
        <SectionTitle link="/catalog">Категории</SectionTitle>
        <div className="category-grid">
          {live.categories.map((cat) => <Link href={cat.href} className={`category-card${cat.soon ? " soon" : ""}`} key={cat.name}><div className="category-image"><Image src={cat.image} alt={cat.name} fill sizes="33vw" unoptimized loading="eager" /><i><ArrowRight /></i></div><span>{cat.name}<small>{cat.soon ? "Скоро в каталоге" : "Смотреть коллекцию"}</small></span></Link>)}
        </div>
      </section>
      <section className="shell production">
        <div className="production-photo"><Image src="/images/process.png" alt="Пошив изделий из джутового каната" fill sizes="(max-width: 900px) 100vw, 46vw" /></div>
        <div className="production-copy">
          <small>За кулисами производства</small>
          <h2>Мэри Джут — уют, созданный с душой</h2>
          <p>Мы шьём ковры и аксессуары для дома из джутового каната. В работе используем специальные швейные машины и технику зигзаг, с помощью которой канат соединяется в цельное полотно. Такая техника позволяет создавать красивые ковры с характерной фактурой джута и прочным, аккуратным пошивом.</p>
          <p>Для нас важно качество в каждой детали: ровная строчка, аккуратное соединение каната и красивая форма готового изделия. Мы внимательно следим за процессом пошива, чтобы каждый ковёр получился именно таким, каким мы задумали его изначально.</p>
          <p>В «Мэри Джут» мы всё делаем сами: придумываем модели, подбираем размеры, шьём, проверяем готовые изделия, упаковываем и отправляем заказы. Нам важно лично участвовать в каждом этапе и знать, что к вам приедет изделие, за которое нам действительно приятно отвечать.</p>
          <p>Мы небольшое производство, где за каждой вещью стоят реальные люди, любовь к своему делу и внимание к тому, что мы создаём. Нам хочется, чтобы наши изделия не просто украшали дом, а становились той самой деталью, которая добавляет ему тепла и уюта.</p>
          <p>Мэри Джут — натуральные материалы, собственное производство и немного нашей души в каждом изделии.</p>
          <p>Выбирайте свой ковёр, а мы с любовью создадим его для вашего дома.</p>
          <Button render={<Link href="/catalog" />}>Выбрать ковёр <ArrowRight /></Button>
        </div>
      </section>
      <section className="shell section interiors">
        <SectionTitle>Фото в интерьере</SectionTitle>
        <div className="interior-grid">
          {[
            ["/images/interiors/01-kover-150.jpg", "Круглый ковёр 150 см у камина", "/product/w014"],
            ["/images/interiors/02-kover-200.jpg", "Круглый ковёр 200 см в гостиной", "/product/w018"],
            ["/images/interiors/03-oval-150.jpg", "Овальный ковёр 80×150 см в гостиной", "/product/w017"],
            ["/images/interiors/04-oval-120.jpg", "Овальный ковёр 80×120 см у дивана", "/product/w008"],
            ["/images/interiors/05-oval-100.jpg", "Овальный ковёр 60×100 см у окна", "/product/w005"],
            ["/images/interiors/06-bedroom.jpg", "Круглый ковёр в спальне", "/product/w003"],
            ["/images/interiors/07-living.jpg", "Круглый ковёр в гостиной", "/product/w002"],
            ["/images/interiors/08-table.jpg", "Сервировка стола джутовыми салфетками", "/product/w010"],
          ].map(([src, alt, href]) => (
            <Link href={href} key={src}>
              <Image src={src} alt={alt} fill sizes="(max-width: 700px) 50vw, 25vw" />
            </Link>
          ))}
        </div>
      </section>
      <section className="shell home-bottom-grid">
        <div className="faq-preview"><span>Помогаем с выбором</span><h2>Частые вопросы</h2>{homeFaqs.map(([question, answer], i) => <div className={`home-faq-item ${homeFaqOpen === i ? "open" : ""}`} key={question}><button type="button" onClick={() => setHomeFaqOpen(homeFaqOpen === i ? null : i)} aria-expanded={homeFaqOpen === i}><b>0{i + 1}</b><span>{question}</span><Plus /></button>{homeFaqOpen === i && <p>{answer}</p>}</div>)}<Link href="/faq">Все вопросы <ArrowRight /></Link></div>
      </section>
    </Page>
  );
}

export function CatalogPage({ initialCategory = "Все", categorySlug = "" }: { initialCategory?: string; categorySlug?: string } = {}) {
  const router = useRouter();
  const live = useLiveCatalog();
  const fromSlug = categorySlug ? live.nameForSlug(categorySlug) : "";
  const requested = fromSlug || (initialCategory && live.tabs.includes(initialCategory) ? initialCategory : "Все");
  const [category, setCategory] = useState(requested || "Все");
  function selectCategory(next: string) {
    if (!live.tabs.includes(next)) return;
    setCategory(next);
    const slug = live.slugFor(next);
    router.push(next === "Все" || !slug ? "/catalog" : `/catalog/${slug}`);
  }
  useEffect(() => {
    const fromUrl = new URLSearchParams(window.location.search).get("category") || requested;
    if (live.tabs.includes(fromUrl)) setCategory(fromUrl);
  }, [requested, live.tabs]);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const [sizeFilters, setSizeFilters] = useState<string[]>([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const itemsInCategory = live.all.filter(item => item.category === category);
  const liveCategory = live.categories.find(item => item.name === category);
  const soon = category !== "Все" && (Boolean(liveCategory?.soon) || (itemsInCategory.length > 0 && itemsInCategory.every(item => item.comingSoon)));
  const activeFilterCount = sizeFilters.length + (maxPrice < 15000 ? 1 : 0) + (query.trim() ? 1 : 0);
  const soonItem = itemsInCategory.find(item => item.comingSoon);
  const filteredProducts = useMemo(() => {
    if (soon) return [];
    const result = live.sale.filter(product => {
      const size = productSizeCm(product);
      const sizeOk = sizeFilters.length === 0 || SIZE_FILTERS.some(filter => sizeFilters.includes(filter.id) && filter.match(size));
      return (category === "Все" || product.category === category)
        && minPrice(product) <= maxPrice
        && product.name.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"))
        && sizeOk;
    });
    if (sort === "price-asc") return [...result].sort((a, b) => minPrice(a) - minPrice(b));
    if (sort === "price-desc") return [...result].sort((a, b) => minPrice(b) - minPrice(a));
    return result;
  }, [category, live.sale, maxPrice, query, sort, soon, sizeFilters]);

  useEffect(() => {
    if (requested && live.tabs.includes(requested)) setCategory(requested);
  }, [requested, live.tabs]);

  useEffect(() => {
    live.sale.forEach(item => {
      const preload = new window.Image();
      preload.src = item.image;
    });
  }, [live.sale]);

  if (categorySlug && live.ready && !fromSlug && !initialCategory) {
    return <Page><div className="shell section"><h1>Категория не найдена</h1><p><Link href="/catalog">Вернуться в каталог</Link></p></div></Page>;
  }

  return (
    <Page>
      <section className="page-hero compact">
        <Image src="/images/hero.png" alt="" fill priority />
        <div className="hero-shade" /><div className="shell"><p>Главная / Каталог{category !== "Все" ? ` / ${category}` : ""}</p><h1>{category === "Все" ? "Каталог" : category}</h1><span>Натуральные материалы, ручная работа<br />и тепло вашего дома</span></div>
      </section>
      <section className="shell catalog-section">
        <div className="catalog-tabs">{live.tabs.map(t => <button key={t} onClick={() => selectCategory(t)} className={category === t ? "selected" : ""}>{t}</button>)}</div>
        <div className="catalog-layout">
          <button
            type="button"
            className={`filters-toggle${filtersOpen ? " is-open" : ""}`}
            onClick={() => setFiltersOpen(open => !open)}
            aria-expanded={filtersOpen}
          >
            <SlidersHorizontal />
            Фильтры
            {activeFilterCount > 0 && <i>{activeFilterCount}</i>}
          </button>
          <aside className={`filters${filtersOpen ? " is-open" : ""}`}>
            <div className="catalog-search"><h4>Поиск</h4><div><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Найти изделие" /><Search /></div></div>
            <div className="price-filter"><h4>Цена до <b>{formatPrice(maxPrice)}</b></h4><div><Input value="1 000" readOnly /><span>—</span><Input value={maxPrice.toLocaleString("ru-RU")} readOnly /></div><input type="range" min="1000" max="15000" step="500" value={maxPrice} onChange={event => setMaxPrice(Number(event.target.value))} /></div>
            <div className="filter-group">
              <h4>Размер</h4>
              {SIZE_FILTERS.map(filter => (
                <label key={filter.id}>
                  <Checkbox
                    checked={sizeFilters.includes(filter.id)}
                    onCheckedChange={checked => {
                      setSizeFilters(current => checked === true
                        ? [...current, filter.id]
                        : current.filter(id => id !== filter.id));
                    }}
                  />
                  {filter.label}
                </label>
              ))}
            </div>
          </aside>
          <div className="catalog-content">
            {soon ? (
              <div className="catalog-soon-block">
                <div className="catalog-soon">
                  <Leaf />
                  <h3>Позиции ещё в разработке</h3>
                  <p>Коллекция «{category}» скоро появится в каталоге. Пока можно выбрать ковры и сервировку стола.</p>
                  <Button variant="outline" onClick={() => selectCategory("Все")}>Смотреть доступные изделия</Button>
                </div>
                {soonItem && (
                  <div className="soon-preview-grid">
                    {soonItem.images.slice(0, 4).map((src) => (
                      <figure className="soon-preview" key={src}>
                        <Image src={src} alt={soonItem.name} fill sizes="(max-width: 700px) 50vw, 25vw" unoptimized />
                        <span>Скоро</span>
                      </figure>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <>
                <div className="catalog-toolbar"><span>Найдено: {filteredProducts.length} товаров</span><label>Сортировка<select value={sort} onChange={event => setSort(event.target.value)}><option value="popular">По популярности</option><option value="price-asc">Сначала дешевле</option><option value="price-desc">Сначала дороже</option></select><ChevronDown /></label></div>
                <div className="product-grid catalog-products">
                  {filteredProducts.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
                {filteredProducts.length === 0 && <div className="catalog-empty"><Search /><h3>Ничего не найдено</h3><p>Измените категорию, цену, размер или поисковый запрос.</p><Button variant="outline" onClick={() => { selectCategory("Все"); setMaxPrice(15000); setQuery(""); setSizeFilters([]); }}>Сбросить фильтры</Button></div>}
              </>
            )}
          </div>
        </div>
      </section>
      <section className="shell catalog-cta"><Image src="/images/basket.png" alt="" fill /><div><p>Не нашли что искали?</p><h2>Закажите индивидуальный<br />размер изделия</h2><Button render={<Link href="/calculator" />}>Рассчитать цену</Button></div></section>
    </Page>
  );
}

export function CalculatorPage() {
  const [shape, setShape] = useState("Круг");
  const [size, setSize] = useState(100);
  const [length, setLength] = useState(140);
  const [rows, setRows] = useState(2);
  const [pattern, setPattern] = useState("С узором");
  const [backing, setBacking] = useState(false);
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [requestSent, setRequestSent] = useState(false);
  const calculation = useMemo(() => {
    const diameterMm = (shape === "Овал" ? (size + length) / 2 : size) * 10;
    const thicknessMm = 8;
    const b = thicknessMm / (2 * Math.PI);
    const theta = Math.PI * diameterMm / thicknessMm;
    const lengthMeters = (b / 2 * (theta * Math.sqrt(theta * theta + 1) + Math.asinh(theta))) / 1000;
    const patternCost = pattern === "С узором" ? rows * 180 : 0;
    const extras = (backing ? 200 : 0) + patternCost;
    const total = Math.max(2900, Math.round((lengthMeters * JUTE_PRICE_PER_METER + extras) / 100) * 100);
    return { total, lengthMeters };
  }, [shape, size, length, rows, pattern, backing]);

  return (
    <Page>
      <section className="page-hero calc-hero"><Image src="/images/hero.png" alt="" fill priority /><div className="hero-shade" /><div className="shell"><p>Главная / Калькулятор</p><h1>Калькулятор стоимости</h1><span>Рассчитайте стоимость ковра<br />по вашим размерам</span></div></section>
      <section className="shell calculator">
        <div className="steps"><span className="active">1 <b>Параметры</b></span><i /><span>2 <b>Расчёт</b></span><i /><span>3 <b>Заявка</b></span></div>
        <div className="calculator-grid">
          <div className="calc-form">
            <h3>Тип изделия</h3>
            <div className="choice-row"><button className="selected" type="button">Ковёр</button></div>
            <h3>Форма</h3>
            <div className="shape-row">{["Круг", "Овал"].map(v => <button onClick={() => setShape(v)} className={shape === v ? "selected" : ""} key={v}><span className={v === "Круг" ? "round" : "oval"} />{v}</button>)}</div>
            <h3>Размеры (см)</h3>
            <div className="field-grid"><label>Ширина / диаметр<Input type="number" value={size} onChange={e => setSize(Math.min(300, Math.max(40, Number(e.target.value))))} min={40} max={300} /><small>от 40 до 300 см</small></label>{shape === "Овал" && <label>Длина<Input type="number" value={length} onChange={e => setLength(Math.min(400, Math.max(60, Number(e.target.value))))} min={60} max={400} /><small>от 60 до 400 см</small></label>}<label>Толщина<Input value="8 мм" disabled /><small>фиксированная</small></label></div>
            <h3>Материал</h3>
            <div className="choice-row option-choices"><button className="selected" type="button">Натуральный джут</button></div>
            <h3>Рисунок</h3>
            <div className="choice-row option-choices">{["С узором", "Без узора"].map(v => <button type="button" onClick={() => setPattern(v)} className={pattern === v ? "selected" : ""} key={v}>{v}</button>)}</div>
            <h3>Оттенок</h3>
            <div className="calc-colors"><button className="selected" type="button"><i style={{ background: "#d5bd91" }} />Натуральный</button></div>
            {pattern === "С узором" && <>
              <h3>Количество рядов с узором</h3>
              <div className="counter"><button type="button" onClick={() => setRows(Math.max(1, rows - 1))}><Minus /></button><span>{rows}</span><button type="button" onClick={() => setRows(Math.min(8, rows + 1))}><Plus /></button></div>
            </>}
            <h3>Дополнительные опции</h3>
            <div className="extra-options"><button type="button" className={backing ? "selected" : ""} onClick={() => setBacking(!backing)}><i>{backing && <Check />}</i><span>Антискользящее покрытие<small>натуральный латекс, ручное нанесение · + 200 ₽</small></span></button></div>
            <label className="calc-check"><Checkbox defaultChecked />Я согласен с отклонением готового изделия ± 2 см</label>
          </div>
          <aside className="estimate-card">
            <p>Примерная стоимость</p><strong>{calculation.total.toLocaleString("ru-RU")} ₽</strong><div className="estimate-spec"><span>Ковёр</span><span>{shape}</span><span>{shape === "Овал" ? `${size} × ${length} см` : `Ø ${size} см`}</span><span>Натуральный джут</span><span>{pattern}</span>{pattern === "С узором" && <span>{rows} {rows === 1 ? "ряд" : "ряда"} узора</span>}{backing && <span>Антискользящее покрытие</span>}</div><div className="estimate-lead"><Input value={leadName} onChange={e => setLeadName(e.target.value)} placeholder="Ваше имя" /><PhoneInput value={leadPhone} onValueChange={setLeadPhone} /></div><Button disabled={!leadName || !isCompleteRuPhone(leadPhone) || requestSent} onClick={async () => { const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "calculator", contact: { name: leadName, phone: leadPhone }, calculation: { shape, size, length, material: "Натуральный джут", pattern, color: "Натуральный", rows: pattern === "С узором" ? rows : 0, backing, ...calculation } }) }); setRequestSent(response.ok); }}>{requestSent ? "Заявка отправлена" : "Отправить заявку"} <ArrowRight /></Button><Image src="/images/products/w014/1.jpg" alt="Круглый джутовый ковёр" width={420} height={420} />
          </aside>
        </div>
      </section>
      <section className="shell how"><h2>Как это работает?</h2><div>{["Выберите форму ковра", "Укажите желаемые размеры", "Получите расчёт и оставьте заявку"].map((t, i) => <article key={t}><b>0{i + 1}</b><span>{t}</span></article>)}</div><p>Толщина изделия — 8 мм. Для овала расчёт ведётся по усреднённому диаметру.</p></section>
    </Page>
  );
}

export function ProductPage({ slug }: { slug: string }) {
  const live = useLiveCatalog();
  const product = live.productBySlug(slug);
  const router = useRouter();
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [backing, setBacking] = useState(false);
  const [activeTab, setActiveTab] = useState<"Описание" | "Характеристики">("Описание");
  const comingSoon = Boolean(product?.comingSoon);
  const siblings = product ? live.sale.filter(item => item.family === product.family) : [];
  const gallery = (product?.images.length ? product.images : [product?.image || ""]).filter(Boolean);
  const [imageIndex, setImageIndex] = useState(0);
  const image = gallery[imageIndex] ?? gallery[0] ?? product?.image ?? "";
  const related = product ? live.sale.filter(item => item.id !== product.id).slice(0, 4) : [];
  const tabs = ["Описание", "Характеристики"] as const;
  const rugBacking = product?.category === "Ковры";
  const unitPrice = (product?.price ?? 0) + (rugBacking && backing ? BACKING_PRICE : 0);

  useEffect(() => {
    setQty(1);
    setAdded(false);
    setBacking(false);
    setActiveTab("Описание");
    setImageIndex(0);
  }, [product?.id]);

  if (!product && !live.ready) {
    return <Page><div className="shell section">Открываем товар…</div></Page>;
  }
  if (!product) {
    return <Page><div className="shell section"><h1>Товар не найден</h1><p><Link href="/catalog">Вернуться в каталог</Link></p></div></Page>;
  }

  return (
    <Page>
      <div className="shell breadcrumb">Главная / {product.category} / {product.name}</div>
      <section className="shell product-detail">
        <div className="gallery">
          <div className="main-image">
            <Image src={image} alt={product.name} fill priority sizes="(max-width: 700px) 100vw, 520px" unoptimized />
            {gallery.length > 1 && (
              <>
                <button type="button" className="gallery-nav prev" onClick={() => setImageIndex((gallery.length + imageIndex - 1) % gallery.length)} aria-label="Предыдущее фото"><ArrowLeft /></button>
                <button type="button" className="gallery-nav next" onClick={() => setImageIndex((imageIndex + 1) % gallery.length)} aria-label="Следующее фото"><ArrowRight /></button>
              </>
            )}
            <button className={isFavorite(product.id) ? "active" : ""} onClick={() => toggleFavorite({ id: product.id, name: product.name, price: product.price, image })}>
              <Heart />
            </button>
          </div>
          {gallery.length > 1 && (
            <div className="thumbnails">
              {gallery.map((src, index) => (
                <button type="button" className={imageIndex === index ? "active" : ""} onClick={() => setImageIndex(index)} key={`${src}-${index}`} aria-label={`Фото ${index + 1}`}>
                  <Image src={src} alt="" fill sizes="72px" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          {product.sku && <p className="product-sku">Артикул {product.sku}</p>}
          {comingSoon ? <strong className="detail-price">Скоро в каталоге</strong> : <strong className="detail-price">{formatPrice(unitPrice)}</strong>}
          {siblings.length > 1 && (
            <div className="option">
              <label>{product.variantKind === "set" ? "Комплектация" : "Размер"}</label>
              <div>{siblings.map(item => <button type="button" className={item.id === product.id ? "selected" : ""} onClick={() => router.push(`/product/${item.slug}`)} key={item.id}>{item.sizeLabel}</button>)}</div>
            </div>
          )}
          {rugBacking && !comingSoon && (
            <div className="extra-options product-backing">
              <button type="button" className={backing ? "selected" : ""} onClick={() => { setBacking(!backing); setAdded(false); }}>
                <i>{backing && <Check />}</i>
                <span>Антискользящее покрытие<small>натуральный латекс, ручное нанесение · + {BACKING_PRICE} ₽</small></span>
              </button>
            </div>
          )}
          {comingSoon ? (
            <div className="soon-buy">
              <p>Позиция ещё в разработке. Коллекция скоро появится в продаже.</p>
              <Button render={<Link href="/catalog" />}>Смотреть доступные изделия</Button>
            </div>
          ) : (
            <div className="buy-row">
              <div className="counter">
                <button onClick={() => setQty(Math.max(1, qty - 1))}><Minus /></button>
                <span>{qty}</span>
                <button onClick={() => setQty(qty + 1)}><Plus /></button>
              </div>
              <Button onClick={() => { addToCart(toCartItem(product, undefined, rugBacking && backing), qty); setAdded(true); }}>{added ? "Товар в корзине" : "В корзину"} <ShoppingBag /></Button>
            </div>
          )}
          <div className="mini-benefits"><span><PackageCheck />Быстрая доставка</span><span><Sparkles />Натуральный джут</span><span><Truck />Возможен возврат</span></div>
        </div>
      </section>
      <section className="shell product-description">
        <div className="description-copy">
          <div className="description-tabs">{tabs.map(tab => <button className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</div>
          {activeTab === "Описание" && (
            <div className="tab-panel">
              {product.description.split("\n\n").map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
          )}
          {activeTab === "Характеристики" && (
            <div className="spec-table">{specRows(product).map(([key, value]) => <div key={key}><span>{key}</span><b>{value}</b></div>)}</div>
          )}
        </div>
        <figure className="description-photo">
          <Image src={gallery[1] ?? gallery[0] ?? product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 420px" unoptimized />
        </figure>
      </section>
      {related.length > 0 && <section className="shell section"><SectionTitle>Похожие товары</SectionTitle><div className="product-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}
    </Page>
  );
}

export function AboutPage() {
  const preview = portfolioPhotos.slice(0, 6);
  return (
    <Page>
      <section className="page-hero about-hero"><Image src="/images/hero.png" alt="" fill priority /><div className="hero-shade" /><div className="shell"><p>Главная / О нас</p><h1>О нас</h1><span>История, которая началась со школьного проекта</span></div></section>
      <article className="shell about-story">
        <p className="eyebrow">Алёна и Стася</p>
        <h2>Мэри Джут — история, которая началась со школьного проекта</h2>
        <div className="about-copy">
          <p>Создаём уют для вашего дома из натурального джута. С душой, вниманием к деталям и любовью к своему делу.</p>
          <p>Привет! Мы — Алёна и Стася, основательницы «Мэри Джут». Когда-то мы просто хотели придумать интересный проект для школьного конкурса. Сегодня у нас собственное производство интерьерных изделий из джута, любимое дело и большая мечта — помогать людям создавать дома, в которые хочется возвращаться.</p>
          <p>Расскажем, как всё начиналось.</p>
        </div>
        <h3>От школьной идеи до собственного производства</h3>
        <div className="about-copy">
          <p>Всё началось в 2024 году. Мы участвовали в школьном конкурсе по предпринимательству, где нужно было придумать бизнес-идею и представить её жюри. Мы долго искали то, что было бы не только интересно нам самим, но и могло бы приносить пользу людям.</p>
          <p>Так появилась идея создавать корзины и плейсматы из натуральных материалов. Мы решили попробовать сделать их своими руками. Тогда это казалось небольшим экспериментом, который должен был закончиться вместе с конкурсом.</p>
          <p>Но всё получилось совсем иначе.</p>
          <p>Наш проект получил хорошие отзывы, а мы выиграли грант на развитие бизнеса. На эти деньги приобрели первые производственные машинки и начали воплощать задуманное в жизнь. Сначала изделия заказывали знакомые, затем о нас стали узнавать люди, которые никогда нас не видели. И каждый новый заказ убеждал нас: то, что мы делаем, действительно кому-то нужно.</p>
          <p>Постепенно маленький проект вырос в настоящее производство. Мы расширили ассортимент, начали создавать ковры для дома и задумались о том, каким хотим видеть наш бренд в будущем.</p>
          <p>Так появилась «Мэри Джут» — дело, в которое мы вкладываем не только время и силы, но и частичку себя.</p>
        </div>
        <h3>Почему именно джут?</h3>
        <div className="about-copy">
          <p>Нам всегда нравились натуральные материалы, спокойные оттенки и вещи, которые не перегружают интерьер, а делают его гармоничнее. Так мы и остановились на джуте.</p>
          <p>Джут — натуральное растительное волокно с характерной фактурой и красивым тёплым оттенком. Он привлекает нас своей выразительностью, прочностью и тем, как естественно вписывается в самые разные интерьеры.</p>
          <p>Нам хотелось создавать изделия, которые не просто выполняют свою функцию, а меняют ощущение пространства. Ковёр, который объединяет мебель в единую композицию. Салфетка, которая делает обычный завтрак немного уютнее. Подставка, благодаря которой даже небольшая деталь на столе выглядит продуманно.</p>
          <p>Мы верим, что уют складывается именно из таких мелочей. Необязательно полностью менять интерьер, чтобы сделать дом красивее. Иногда достаточно одной детали, выбранной с любовью.</p>
          <p>Поэтому в основе «Мэри Джут» — натуральная фактура, сдержанные цвета, лаконичные формы и внимание к качеству.</p>
        </div>
        <h3>Создаём сами — от идеи до готового изделия</h3>
        <div className="about-copy">
          <p>За каждым изделием «Мэри Джут» стоит наша работа. Мы самостоятельно развиваем производство, продумываем ассортимент, подбираем материалы и следим за тем, чтобы готовые изделия соответствовали нашим представлениям о качестве.</p>
          <p>Для нас важно не просто выпустить очередную модель, а создать вещь, которую захочется оставить в доме надолго.</p>
          <p>Мы используем производственное оборудование, чтобы добиваться аккуратных швов, ровных краёв и стабильного качества. При этом сохраняем главное — внимание к деталям, благодаря которому изделие выглядит завершённым и гармоничным.</p>
          <p>Сегодня мы создаём ковры, сервировочные салфетки и подставки из джута. Постепенно расширяем ассортимент и работаем над новыми изделиями для дома.</p>
          <p>Наше производство находится в Ульяновской области. Здесь мы продолжаем развивать дело, которое когда-то начиналось с небольшой школьной идеи.</p>
        </div>
        <h3>Наш стиль — уют без лишнего</h3>
        <div className="about-copy">
          <p>Мы хотим, чтобы изделия «Мэри Джут» легко становились частью вашего дома. Не спорили с интерьером, а дополняли его. Не привязывали к одному стилю, а давали возможность создавать собственные сочетания.</p>
          <p>Именно поэтому мы уделяем особое внимание форме.</p>
          <p>В нашем ассортименте вы найдёте круглые и овальные ковры разных размеров. Мы выбрали эти формы не случайно: мягкие линии помогают визуально смягчить пространство и красиво сочетаются с мебелью, текстилем и натуральными материалами.</p>
          <p>Наши изделия подходят для разных зон дома: спальни, гостиной, кухни или прихожей. А небольшие джутовые аксессуары помогают объединить детали интерьера и сделать сервировку стола более выразительной.</p>
          <p>Мы стараемся создавать вещи, которые не теряют актуальности с очередным изменением трендов. Ведь настоящий уют — это не про моду на один сезон, а про ощущение, которое остаётся с вами каждый день.</p>
        </div>
        <h3>Для нас каждый заказ — это доверие</h3>
        <div className="about-copy">
          <p>Когда мы только начинали, каждый покупатель был для нас особенным событием. Мы радовались каждому сообщению, каждому отзыву и каждому вопросу о наших изделиях.</p>
          <p>С ростом производства это отношение не изменилось.</p>
          <p>Нам важно, чтобы вам было легко выбрать подходящий размер, понять особенности изделия и разобраться в уходе за ним. Поэтому мы готовы помочь с выбором и ответить на вопросы до и после покупки.</p>
          <p>Мы понимаем, что вы выбираете не просто ковёр или аксессуар. Вы выбираете вещь, которой предстоит стать частью вашего пространства, ваших привычек и повседневных моментов.</p>
          <p>И нам хочется, чтобы покупка «Мэри Джут» приносила радость не только в день получения заказа, но и спустя долгое время.</p>
        </div>
        <h3>Сегодня мы только начинаем</h3>
        <div className="about-copy">
          <p>Иногда мы вспоминаем тот самый школьный конкурс и с удивлением думаем о том, как далеко нас привела одна идея.</p>
          <p>Впереди ещё много планов: новые формы, новые изделия, развитие производства и новые возможности для тех, кто выбирает наш бренд. Мы хотим расти, сохраняя то, с чего всё началось: искренний интерес к своему делу, любовь к натуральным материалам и желание создавать красивые вещи для дома.</p>
          <p>Для нас «Мэри Джут» — это больше, чем производство. Это история о том, как идея двух девушек превратилась в дело жизни. И нам очень приятно, что теперь частью этой истории становитесь вы.</p>
          <p>Спасибо, что выбираете нас и впускаете наши изделия в свой дом.</p>
          <p>С теплом,<br />Алёна и Стася — основательницы «Мэри Джут»</p>
        </div>
        <h3>Найдите свою деталь уюта</h3>
        <div className="about-copy">
          <p>Выбирайте джутовые ковры, салфетки и аксессуары, которые помогут сделать ваш дом ещё уютнее.</p>
          <p>Посмотрите каталог «Мэри Джут» и найдите изделие, которое станет частью вашей истории дома.</p>
        </div>
        <div className="about-actions">
          <Button render={<Link href="/catalog" />}>Смотреть каталог <ArrowRight /></Button>
        </div>
      </article>
      <section className="shell about-preview">
        <SectionTitle link="/portfolio">Из портфолио</SectionTitle>
        <div className="about-preview-grid">
          {preview.map(photo => (
            <Link href="/portfolio" key={photo.src} className="about-preview-card">
              <Image src={photo.src} alt={photo.alt} fill sizes="16vw" unoptimized loading="eager" />
            </Link>
          ))}
        </div>
      </section>
    </Page>
  );
}

export function PortfolioPage() {
  const [open, setOpen] = useState<number | null>(null);
  const photo = open === null ? null : portfolioPhotos[open];
  useEffect(() => {
    document.body.style.overflow = photo ? "hidden" : "";
    const onKey = (event: KeyboardEvent) => { if (event.key === "Escape") setOpen(null); };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [photo]);
  return (
    <Page>
      <section className="page-hero about-hero"><Image src="/images/about/home.jpg" alt="" fill priority unoptimized /><div className="hero-shade" /><div className="shell"><p>Главная / Портфолио</p><h1>Портфолио</h1><span>Живые кадры наших работ — без инфографики</span></div></section>
      <section className="shell portfolio-intro">
        <div>
          <p className="eyebrow">Наши работы</p>
          <h2>Коллаж изделий, которые уже живут в домах</h2>
        </div>
        <p>Ковры, салфетки, подставки и корзины с собственного производства. Открывайте кадр, чтобы рассмотреть фактуру.</p>
      </section>
      <section className="shell portfolio-collage">
        {portfolioPhotos.map((item, index) => (
          <button type="button" key={item.src} onClick={() => setOpen(index)} aria-label={item.alt}>
            <Image src={item.src} alt={item.alt} fill sizes="33vw" unoptimized loading="eager" />
          </button>
        ))}
      </section>
      {photo && (
        <div className="portfolio-lightbox" role="dialog" aria-modal="true" aria-label={photo.alt} onClick={() => setOpen(null)}>
          <button type="button" className="lightbox-close" onClick={() => setOpen(null)} aria-label="Закрыть"><X /></button>
          <Image src={photo.src} alt={photo.alt} width={photo.width} height={photo.height} unoptimized onClick={event => event.stopPropagation()} />
        </div>
      )}
    </Page>
  );
}

function InfoHero({ title, subtitle }: { title: string; subtitle: string }) {
  return <section className="page-hero info-hero"><Image src="/images/hero-dining.png" alt="" fill priority /><div className="hero-shade" /><div className="shell"><p>Главная / {title}</p><h1>{title}</h1><span>{subtitle}</span></div></section>;
}

export function DeliveryPage() {
  return (
    <Page>
      <InfoHero title="Доставка" subtitle="Бережно доставляем изделия по всей России" />
      <section className="shell info-layout">
        <div className="info-main"><p className="eyebrow">Сразу по делу</p><h2>Доставка и оплата</h2><p>Ozon — от 350 ₽ до пункта выдачи. СДЭК — от 490 ₽. Отправка готового изделия — 1–3 рабочих дня. От 15 000 ₽ доставка до пункта бесплатная. Заказ из нескольких товаров оплачивается одной суммой, одной ссылкой.</p><div className="info-card-grid">
          <article><Truck /><span><b>СДЭК</b><small>До пункта выдачи или курьером</small></span><strong>от 490 ₽</strong></article>
          <article><PackageCheck /><span><b>Ozon Доставка</b><small>До выбранного пункта выдачи</small></span><strong>от 350 ₽</strong></article>
          <article><MapPin /><span><b>Самовывоз</b><small>По согласованию из мастерской</small></span><strong>Бесплатно</strong></article>
        </div><div className="info-copy"><h3>Как проходит доставка</h3><ol><li><b>Оформите заказ</b><span>Выберите изделие и укажите удобный способ получения.</span></li><li><b>Мы бережно упакуем</b><span>Защитим изделие от влаги и повреждений.</span></li><li><b>Получите уведомление</b><span>Отправим трек-номер на e-mail или в мессенджер.</span></li></ol></div></div>
        <aside className="info-aside"><Clock3 /><h3>Сроки доставки</h3><p>Срок изготовления и отправки готовых изделий — 1–3 рабочих дня. Индивидуальные заказы согласовываются отдельно.</p><div><span>Центральный регион</span><b>2–5 дней</b></div><div><span>Южные регионы</span><b>3–7 дней</b></div><div><span>Другие регионы</span><b>4–10 дней</b></div><Button render={<Link href="/contacts" />}>Уточнить срок</Button></aside>
      </section>
      <section className="shell delivery-note"><Leaf /><div><h3>Бесплатная доставка</h3><p>Для заказов от 15 000 ₽ доставка до пункта выдачи — за наш счёт.</p></div></section>
    </Page>
  );
}

export function PaymentPage() {
  return (
    <Page>
      <InfoHero title="Оплата" subtitle="Один заказ — одна сумма" />
      <section className="shell payment-section">
        <div>
          <p className="eyebrow">Одна оплата</p>
          <h2>Весь заказ оплачивается один раз</h2>
          <p>В корзине может быть несколько изделий. После оформления вы видите одну сумму. Менеджер отправляет одну ссылку на оплату всего заказа — на телефон и почту. Отдельных ссылок на каждую позицию нет.</p>
        </div>
        <div className="payment-grid">
          <article><CreditCard /><h3>Одна сумма</h3><p>Стоимость всех изделий складывается в один итог. Платить пять раз за пять товаров не нужно.</p><span>Весь заказ</span></article>
          <article><WalletCards /><h3>Ссылка от менеджера</h3><p>После заявки менеджер присылает одну ссылку на оплату. Карту мы на сайте не храним.</p><span>На телефон и почту</span></article>
          <article><Banknote /><h3>Доставка отдельно</h3><p>Ozon от 350 ₽, СДЭК от 490 ₽. От 15 000 ₽ доставка до пункта выдачи бесплатная.</p><span>Считается в заказе</span></article>
        </div>
      </section>
      <section className="shell payment-steps">
        <h2>Как происходит оплата</h2>
        <div>
          {["Добавьте изделия в корзину", "Оформите один заказ", "Получите одну ссылку на всю сумму", "Оплатите заказ один раз"].map((text, i) => (
            <span key={text}><b>0{i + 1}</b>{text}</span>
          ))}
        </div>
      </section>
    </Page>
  );
}

export function ContactsPage() {
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  async function submitContact(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSending(true);
    const data = Object.fromEntries(new FormData(event.currentTarget).entries());
    const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "contact", data }) });
    setSending(false);
    setSent(response.ok);
  }
  return (
    <Page>
      <InfoHero title="Контакты" subtitle="Всегда готовы помочь с выбором и заказом" />
      <section className="shell contacts-layout">
        <div className="contact-details"><p className="eyebrow">Связаться с нами</p><h2>Давайте обсудим ваш будущий уют</h2><p>Расскажем об изделиях, поможем подобрать размер и рассчитаем индивидуальный заказ.</p><div><a href={PHONE_HREF}><span><MessageCircle /></span><b>{PHONE_DISPLAY}<small>пн–пт, 10:00–19:00 (МСК)</small></b></a><a href={CONTACT_MAILTO}><span><Mail /></span><b>{CONTACT_EMAIL}<small>Ответим в течение рабочего дня</small></b></a><p><span><MapPin /></span><b>г. Ульяновск, ул. Карла Либкнехта, д. 5<small>Россия</small></b></p></div><div className="contact-socials">{socialLinks.map(item => <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">{item.name}</a>)}</div></div>
        <form className="contact-form" onSubmit={submitContact}><span>Напишите нам</span><h3>Ответим на ваш вопрос</h3><label>Ваше имя<Input name="name" required placeholder="Мария" /></label><label>Телефон<PhoneInput name="phone" required /></label><label>E-mail<Input name="email" type="email" placeholder="mail@example.ru" /></label><label>Сообщение<textarea name="message" required placeholder="Расскажите, чем мы можем помочь" /></label><label className="calc-check"><Checkbox defaultChecked />Согласен с политикой конфиденциальности</label><Button type="submit" disabled={sending || sent}>{sent ? "Сообщение отправлено" : sending ? "Отправляем..." : "Отправить сообщение"} <ArrowRight /></Button></form>
      </section>
    </Page>
  );
}
