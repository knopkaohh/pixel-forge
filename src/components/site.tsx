"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Banknote,
  Check,
  ChevronDown,
  Clock3,
  CreditCard,
  ExternalLink,
  Heart,
  Leaf,
  Mail,
  Menu,
  MessageCircle,
  Minus,
  MapPin,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
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
import {
  catalogTabs,
  categories,
  comingSoonCategories,
  comingSoonItems,
  getProduct,
  minPrice,
  products,
  specRows,
  toCartItem,
  type CatalogProduct,
} from "@/lib/products";

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
    ["Избранное", "/favorites"],
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
      <div className="announcement">Бесплатная доставка при заказе от 15 000 ₽</div>
      <header className="site-header">
        <div className="shell header-inner">
          <Logo />
          <nav className="desktop-nav">
            {nav.map(([label, href]) => (
              <Link key={label} href={href}>{label}</Link>
            ))}
          </nav>
          <div className="header-actions">
            <a className="phone" href="tel:+79278000000">+7 (927) 800-00-00</a>
            <button aria-label="Поиск"><Search /></button>
            <Link className="header-icon" href="/favorites" aria-label="Избранное"><Heart />{favorites.length > 0 && <i>{favorites.length}</i>}</Link>
            <Link className="header-icon" href="/account" aria-label="Личный кабинет"><UserRound /></Link>
            <Link className="header-icon bag" href="/cart" aria-label="Корзина"><ShoppingBag />{cartCount > 0 && <i>{cartCount}</i>}</Link>
            <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Открыть меню"><Menu /></button>
          </div>
        </div>
      </header>
      {open && (
        <div className="menu-overlay" onClick={() => setOpen(false)}>
          <div className="mobile-drawer" role="dialog" aria-modal="true" aria-label="Меню сайта" onClick={event => event.stopPropagation()}>
            <div className="drawer-head"><Logo /><button onClick={() => setOpen(false)} aria-label="Закрыть меню"><X /></button></div>
            <div className="drawer-columns">
              <nav><span>Основное</span>{nav.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}<ArrowRight /></Link>)}</nav>
              <nav><span>Покупателям</span>{moreNav.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}<ArrowRight /></Link>)}</nav>
            </div>
            <div className="drawer-contact"><span>Нужна помощь с выбором?</span><a href="tel:+79278000000">+7 (927) 800-00-00</a><Link href="/contacts" onClick={() => setOpen(false)}>Написать нам</Link></div>
          </div>
        </div>
      )}
    </>
  );
}

export function Footer() {
  return (
    <footer className="footer" id="contacts">
      <div className="newsletter">
        <div className="shell newsletter-inner">
          <div><span>Письма о натуральном уюте</span><h3>Будьте в курсе новинок и акций</h3></div>
          <div className="subscribe"><Input placeholder="Ваш e-mail" /><Button>Подписаться <ArrowRight /></Button></div>
        </div>
      </div>
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p>Интерьерные изделия из натурального джута,<br />созданные вручную с душой в России.</p>
          <div className="socials"><a href="#">VK</a><a href="#">TG</a><a href="#">MAX</a></div>
        </div>
        <div><h4>Покупателям</h4><Link href="/catalog">Каталог</Link><Link href="/promotions">Акции</Link><Link href="/delivery">Доставка</Link><Link href="/payment">Оплата</Link><Link href="/returns">Возврат</Link><Link href="/warranty">Гарантия</Link><Link href="/care">Уход за изделиями</Link></div>
        <div><h4>О мастерской</h4><Link href="/about">О компании</Link><Link href="/faq">Вопросы и ответы</Link><Link href="/certificates">Сертификаты</Link><Link href="/contacts">Контакты</Link><Link href="/privacy">Конфиденциальность</Link><Link href="/terms">Соглашение</Link></div>
        <div className="footer-contact"><h4>Связаться с нами</h4><a href="tel:+79278000000">+7 (927) 800-00-00</a><a href="mailto:hello@mary-jute.ru">hello@mary-jute.ru</a><p>Ежедневно с 9:00 до 20:00<br />Ульяновская область</p><Button variant="outline" render={<Link href="/contacts" />}>Написать нам</Button></div>
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
        <span className="product-badge">{soon ? "Скоро" : "Ручная работа"}</span>
      </Link>
      <button className={`heart ${liked ? "active" : ""}`} onClick={() => toggleFavorite({ id: product.id, name: product.name, price, image: product.image })} aria-label="Добавить в избранное" aria-pressed={liked}><Heart /></button>
      <div className="product-copy">
        <Link href={href}><h3>{product.name}</h3></Link>
        <p>{soon ? "Коллекция готовится к публикации" : "Натуральный джут · в наличии"}</p>
        <div className="product-bottom">
          {soon ? <strong>Скоро в каталоге</strong> : <strong>{product.variants.length > 1 ? `от ${formatPrice(price)}` : formatPrice(price)}</strong>}
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
  const slides = [
    { image: "/images/hero.png", eyebrow: "Интерьерные изделия из джута", title: <>Природный уют<br />в вашем доме</>, text: "Ковры, корзины, панно и декор ручной работы" },
    { image: "/images/hero-dining.png", eyebrow: "Коллекция «Тёплый дом»", title: <>Фактура природы<br />в каждой детали</>, text: "Уникальные изделия, созданные для вашего пространства" },
    { image: "/images/hero-craft.png", eyebrow: "Сделано руками мастера", title: <>С душой.<br />Для вашего дома.</>, text: "Собственное производство в России и натуральный джут" },
  ];
  const [slide, setSlide] = useState(0);
  const [homeFaqOpen, setHomeFaqOpen] = useState<number | null>(null);
  const homeFaqs = [
    ["Как ухаживать за изделиями?", "Используйте сухую чистку мягкой щёткой или пылесосом на небольшой мощности. Не замачивайте изделие полностью."],
    ["Можно ли заказать свой размер?", "Да. Укажите форму и размеры в калькуляторе, а мастер уточнит детали и подтвердит итоговую стоимость."],
    ["Почему новое изделие имеет запах?", "Это естественный аромат натурального джута. После проветривания он становится значительно слабее в течение нескольких дней."],
  ];
  useEffect(() => {
    const timer = window.setTimeout(() => setSlide((slide + 1) % slides.length), 4500);
    return () => window.clearTimeout(timer);
  }, [slide, slides.length]);

  return (
    <Page>
      <section className="hero">
        <div className="hero-slides" aria-live="polite">
          {slides.map((item, index) => <Image key={item.image} className={slide === index ? "active" : ""} src={item.image} alt="Интерьер с изделиями из джута" fill priority={index === 0} sizes="100vw" />)}
        </div>
        <div className="hero-shade" />
        <div className="shell hero-content">
          <p>{slides[slide].eyebrow}</p>
          <h1>{slides[slide].title}</h1>
          <span>{slides[slide].text}<br />от российского производителя</span>
          <Button className="light-button" render={<Link href="/catalog" />}>Перейти в каталог <ArrowRight /></Button>
        </div>
        <div className="hero-controls shell">
          <div>{slides.map((_, i) => <button type="button" key={i} className={slide === i ? "active" : ""} onClick={() => setSlide(i)} aria-label={`Слайд ${i + 1}`} />)}</div>
          <span><button type="button" onClick={() => setSlide((slide - 1 + slides.length) % slides.length)} aria-label="Предыдущий слайд"><ArrowLeft /></button><b>0{slide + 1}</b><i>/</i><small>0{slides.length}</small><button type="button" onClick={() => setSlide((slide + 1) % slides.length)} aria-label="Следующий слайд"><ArrowRight /></button></span>
        </div>
        <div className="hero-note"><Leaf /><span>100% натуральный<br /><b>джут</b></span></div>
      </section>
      <Benefits />
      <section className="shell section">
        <SectionTitle link="/catalog">Популярные категории</SectionTitle>
        <div className="category-grid">
          {categories.map((cat) => <Link href={cat.href} className={`category-card${cat.soon ? " soon" : ""}`} key={cat.name}><div className="category-image"><Image src={cat.image} alt={cat.name} fill sizes="33vw" unoptimized /><i><ArrowRight /></i></div><span>{cat.name}<small>{cat.soon ? "Скоро в каталоге" : "Смотреть коллекцию"}</small></span></Link>)}
        </div>
      </section>
      <section className="shell collection-showcase">
        <div className="collection-main"><Image src="/images/hero-dining.png" alt="Коллекция джутовых ковров" fill /><div><span>Новая коллекция</span><h2>Дом, в котором<br />хочется остаться</h2><Link href="/catalog">Смотреть коллекцию <ArrowRight /></Link></div></div>
        <Link href="/catalog?category=Салфетки сервировочные" className="collection-small"><Image src="/images/categories/salfetki.jpg" alt="Сервировочные салфетки из джута" fill /><span>Салфетки и сервировка<small>Наборы 2 и 5 шт</small></span></Link>
      </section>
      <section className="shell story-banner">
        <Image src="/images/hero.png" alt="" fill sizes="100vw" />
        <div className="story-copy"><em>Индивидуальное изготовление</em><p>Эксклюзивные изделия для вашего пространства</p><span>Подберём форму, размер и оттенок. Каждое изделие создаём вручную — от первого витка до последнего стежка.</span><Button render={<Link href="/calculator" />}>Рассчитать стоимость <ArrowRight /></Button></div>
      </section>
      <section className="shell section">
        <SectionTitle link="/catalog">Популярные товары</SectionTitle>
        <div className="product-grid">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
      </section>
      <section className="shell promo">
        <Image src="/images/process.png" alt="Процесс создания изделий из джута" fill sizes="100vw" />
        <div><small>За кулисами мастерской</small><p>Наши изделия рождаются<br />с любовью к деталям</p><span>Посмотрите, как создаётся натуральный уют</span><Button variant="secondary" render={<Link href="/about" />}>Смотреть историю <ArrowRight /></Button></div>
        <Link className="play-button" href="/about" aria-label="Смотреть историю компании">▶</Link>
      </section>
      <section className="shell section reviews">
        <SectionTitle>Отзывы</SectionTitle>
        <div className="review-grid">
          {[
            ["Елена П.", "Ковёр великолепный — плотный, аккуратный и очень уютный. Видно, что сделан руками."],
            ["Ольга К.", "Корзина идеально вписалась в интерьер. Упаковка бережная, доставка быстрая."],
            ["Наталья С.", "Заказывала нестандартный размер. Всё подробно согласовали, результат превзошёл ожидания."],
          ].map(([name, text], i) => <article key={name}><div className="review-top"><Image src={i === 1 ? "/images/craftswoman.png" : "/images/hero.png"} alt="" width={52} height={52} /><span><b>{name}</b><small>Покупатель</small></span><i>“</i></div><div className="stars">★★★★★</div><p>{text}</p><a href="#">Читать полностью</a></article>)}
        </div>
        <div className="review-summary"><strong>4,9</strong><span><b>★★★★★</b>На основе 186 отзывов</span><div>{["Яндекс", "Ozon", "Wildberries"].map((v) => <i key={v}><Check />{v}</i>)}</div></div>
      </section>
      <section className="shell home-bottom-grid">
        <div className="faq-preview"><span>Помогаем с выбором</span><h2>Частые вопросы</h2>{homeFaqs.map(([question, answer], i) => <div className={`home-faq-item ${homeFaqOpen === i ? "open" : ""}`} key={question}><button type="button" onClick={() => setHomeFaqOpen(homeFaqOpen === i ? null : i)} aria-expanded={homeFaqOpen === i}><b>0{i + 1}</b><span>{question}</span><Plus /></button>{homeFaqOpen === i && <p>{answer}</p>}</div>)}<Link href="/faq">Все вопросы <ArrowRight /></Link></div>
        <div className="where-buy"><Image src="/images/basket.png" alt="" fill /><div><span>Удобно покупать</span><h2>Мы также<br />на маркетплейсах</h2><p>Wildberries · Ozon · Яндекс Маркет</p><Button variant="secondary">Где купить</Button></div></div>
      </section>
    </Page>
  );
}

function FilterGroup({ title, values }: { title: string; values: string[] }) {
  return (
    <div className="filter-group"><h4>{title}<ChevronDown /></h4>
      {values.map((v, i) => <label key={v}><Checkbox defaultChecked={i === 0} />{v}</label>)}
    </div>
  );
}

export function CatalogPage({ initialCategory = "Все" }: { initialCategory?: string }) {
  const requested = catalogTabs.includes(initialCategory as typeof catalogTabs[number]) ? initialCategory : "Все";
  const [category, setCategory] = useState(requested);
  const [maxPrice, setMaxPrice] = useState(15000);
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const soon = comingSoonCategories.includes(category as typeof comingSoonCategories[number]);
  const soonItem = comingSoonItems.find(item => item.category === category);
  const filteredProducts = useMemo(() => {
    if (soon) return [];
    const result = products.filter(product =>
      (category === "Все" || product.category === category) &&
      minPrice(product) <= maxPrice &&
      product.name.toLocaleLowerCase("ru").includes(query.trim().toLocaleLowerCase("ru"))
    );
    if (sort === "price-asc") return [...result].sort((a, b) => minPrice(a) - minPrice(b));
    if (sort === "price-desc") return [...result].sort((a, b) => minPrice(b) - minPrice(a));
    return result;
  }, [category, maxPrice, query, sort, soon]);

  useEffect(() => {
    if (catalogTabs.includes(requested as typeof catalogTabs[number])) setCategory(requested);
  }, [requested]);

  useEffect(() => {
    [...products, ...comingSoonItems].forEach(item => {
      [item.image, ...item.images.slice(0, 4)].forEach(src => {
        const preload = new window.Image();
        preload.src = src;
      });
    });
  }, []);

  return (
    <Page>
      <section className="page-hero compact">
        <Image src="/images/hero.png" alt="" fill priority />
        <div className="hero-shade" /><div className="shell"><p>Главная / Каталог</p><h1>Каталог</h1><span>Натуральные материалы, ручная работа<br />и тепло вашего дома</span></div>
      </section>
      <section className="shell catalog-section">
        <div className="catalog-tabs">{catalogTabs.map(t => <button key={t} onClick={() => setCategory(t)} className={category === t ? "selected" : ""}>{t}</button>)}</div>
        <div className="catalog-layout">
          <aside className="filters">
            <div className="catalog-search"><h4>Поиск</h4><div><Input value={query} onChange={event => setQuery(event.target.value)} placeholder="Найти изделие" /><Search /></div></div>
            <div className="price-filter"><h4>Цена до <b>{formatPrice(maxPrice)}</b></h4><div><Input value="1 000" readOnly /><span>—</span><Input value={maxPrice.toLocaleString("ru-RU")} readOnly /></div><input type="range" min="1000" max="15000" step="500" value={maxPrice} onChange={event => setMaxPrice(Number(event.target.value))} /></div>
            <FilterGroup title="Размер" values={["до 60 см", "60–100 см", "100–150 см", "более 150 см"]} />
            <div className="filter-group swatch-filter"><h4>Цвет<ChevronDown /></h4><div>{["#d5bd91", "#b17c43", "#6f5b42", "#204b31", "#eee9de"].map((value, i) => <button className={i === 0 ? "selected" : ""} style={{background:value}} key={value} aria-label={`Цвет ${i + 1}`}>{i === 0 && <Check />}</button>)}</div></div>
            <FilterGroup title="Материал" values={["Джут", "Хлопок", "Смешанный"]} />
          </aside>
          <div className="catalog-content">
            {soon ? (
              <div className="catalog-soon-block">
                <div className="catalog-soon">
                  <Leaf />
                  <h3>Позиции ещё в разработке</h3>
                  <p>Коллекция «{category}» скоро появится в каталоге. Пока можно выбрать ковры, салфетки и подставки под горячее.</p>
                  <Button variant="outline" onClick={() => setCategory("Все")}>Смотреть доступные изделия</Button>
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
                {filteredProducts.length === 0 && <div className="catalog-empty"><Search /><h3>Ничего не найдено</h3><p>Измените категорию, цену или поисковый запрос.</p><Button variant="outline" onClick={() => { setCategory("Все"); setMaxPrice(15000); setQuery(""); }}>Сбросить фильтры</Button></div>}
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
  const [material, setMaterial] = useState("Натуральный джут");
  const [pattern, setPattern] = useState("Классический");
  const [color, setColor] = useState("Натуральный");
  const [edge, setEdge] = useState(true);
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
    const materialRate = material === "Джут + хлопок" ? 1.18 : 1;
    const patternCost = pattern === "Ажурный" ? 900 : pattern === "Классический" ? rows * 180 : 0;
    const extras = (edge ? 600 : 0) + (backing ? 1200 : 0) + patternCost;
    const total = Math.max(2900, Math.round((lengthMeters * JUTE_PRICE_PER_METER * materialRate + extras) / 100) * 100);
    return { total, lengthMeters };
  }, [shape, size, length, rows, material, pattern, edge, backing]);

  return (
    <Page>
      <section className="page-hero calc-hero"><Image src="/images/hero.png" alt="" fill priority /><div className="hero-shade" /><div className="shell"><p>Главная / Калькулятор</p><h1>Калькулятор стоимости</h1><span>Рассчитайте стоимость изделия ручной работы<br />по индивидуальным размерам</span></div></section>
      <section className="shell calculator">
        <div className="steps"><span className="active">1 <b>Параметры</b></span><i /><span>2 <b>Расчёт</b></span><i /><span>3 <b>Заявка</b></span></div>
        <div className="calculator-grid">
          <div className="calc-form">
            <h3>Тип изделия</h3>
            <div className="choice-row">{["Ковёр", "Корзина", "Панно", "Декор"].map((v, i) => <button className={i === 0 ? "selected" : ""} key={v}>{v}</button>)}</div>
            <h3>Форма</h3>
            <div className="shape-row">{["Круг", "Овал"].map(v => <button onClick={() => setShape(v)} className={shape === v ? "selected" : ""} key={v}><span className={v === "Круг" ? "round" : "oval"} />{v}</button>)}</div>
            <h3>Размеры (см)</h3>
            <div className="field-grid"><label>Ширина / диаметр<Input type="number" value={size} onChange={e => setSize(Math.min(300, Math.max(40, Number(e.target.value))))} min={40} max={300} /><small>от 40 до 300 см</small></label>{shape === "Овал" && <label>Длина<Input type="number" value={length} onChange={e => setLength(Math.min(400, Math.max(60, Number(e.target.value))))} min={60} max={400} /><small>от 60 до 400 см</small></label>}<label>Толщина<Input value="8 мм" disabled /><small>фиксированная</small></label></div>
            <h3>Материал</h3>
            <div className="choice-row option-choices">{["Натуральный джут", "Джут + хлопок"].map(v => <button onClick={() => setMaterial(v)} className={material === v ? "selected" : ""} key={v}>{v}</button>)}</div>
            <h3>Рисунок плетения</h3>
            <div className="choice-row option-choices">{["Классический", "Ажурный", "Без узора"].map(v => <button onClick={() => setPattern(v)} className={pattern === v ? "selected" : ""} key={v}>{v}</button>)}</div>
            <h3>Оттенок</h3>
            <div className="calc-colors">{[["Натуральный", "#d5bd91"], ["Карамель", "#a8753d"], ["Тёмный", "#62513d"]].map(([name, value]) => <button onClick={() => setColor(name)} className={color === name ? "selected" : ""} key={name}><i style={{background:value}} />{name}</button>)}</div>
            <h3>Количество рядов с узором</h3>
            <div className="counter"><button onClick={() => setRows(Math.max(0, rows - 1))}><Minus /></button><span>{rows}</span><button onClick={() => setRows(Math.min(8, rows + 1))}><Plus /></button></div>
            <h3>Дополнительные опции</h3>
            <div className="extra-options"><button className={edge ? "selected" : ""} onClick={() => setEdge(!edge)}><i>{edge && <Check />}</i><span>Обработка края<small>+ 600 ₽</small></span></button><button className={backing ? "selected" : ""} onClick={() => setBacking(!backing)}><i>{backing && <Check />}</i><span>Антискользящая основа<small>+ 1 200 ₽</small></span></button></div>
            <label className="calc-check"><Checkbox defaultChecked />Я согласен с отклонением готового изделия ± 2 см</label>
          </div>
          <aside className="estimate-card">
            <p>Примерная стоимость</p><strong>{calculation.total.toLocaleString("ru-RU")} ₽</strong><div className="estimate-spec"><span>{shape}</span><span>{shape === "Овал" ? `${size} × ${length} см` : `Ø ${size} см`}</span><span>{calculation.lengthMeters.toFixed(1)} м джута</span><span>{material}</span><span>{pattern}</span><span>{color}</span></div><span>Расчёт по спирали, толщина 8 мм<br />и тариф {JUTE_PRICE_PER_METER} ₽/м. Итог подтвердит мастер.</span><div className="estimate-lead"><Input value={leadName} onChange={e => setLeadName(e.target.value)} placeholder="Ваше имя" /><Input value={leadPhone} onChange={e => setLeadPhone(e.target.value)} placeholder="+7 (___) ___-__-__" /></div><Button disabled={!leadName || !leadPhone || requestSent} onClick={async () => { const response = await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "calculator", contact: { name: leadName, phone: leadPhone }, calculation: { shape, size, length, material, pattern, color, rows, edge, backing, ...calculation } }) }); setRequestSent(response.ok); }}>{requestSent ? "Заявка отправлена" : "Отправить заявку"} <ArrowRight /></Button><Image src="/images/basket.png" alt="Джутовая корзина" width={420} height={420} />
          </aside>
        </div>
      </section>
      <section className="shell how"><h2>Как это работает?</h2><div>{["Выберите тип и форму изделия", "Укажите желаемые размеры", "Получите расчёт и оставьте заявку"].map((t, i) => <article key={t}><b>0{i + 1}</b><span>{t}</span></article>)}</div><p>Толщина изделия — 8 мм. Для овала расчёт ведётся по усреднённому диаметру.</p></section>
    </Page>
  );
}

export function ProductPage({ slug }: { slug: string }) {
  const product = getProduct(slug) ?? products[0];
  const comingSoon = Boolean(product.comingSoon) || product.variants.length === 0;
  const { addToCart, toggleFavorite, isFavorite } = useShop();
  const [variantId, setVariantId] = useState(product.variants[0]?.id ?? "");
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [activeTab, setActiveTab] = useState<"Описание" | "Характеристики" | "Отзывы">("Описание");
  const variant = product.variants.find(item => item.id === variantId) ?? product.variants[0];
  const gallery = variant?.images?.length ? variant.images : product.images;
  const [imageIndex, setImageIndex] = useState(0);
  const image = gallery[imageIndex] ?? gallery[0] ?? product.image;
  const related = products.filter(item => item.id !== product.id);
  const bundle = comingSoon ? [] : products.filter(item => item.id !== product.id).slice(0, 2);
  const bundleItems = [product, ...bundle];
  const tabs = ["Описание", "Характеристики", "Отзывы"] as const;
  const reviews = product.reviews ?? [];

  useEffect(() => {
    setVariantId(product.variants[0]?.id ?? "");
    setQty(1);
    setAdded(false);
    setActiveTab("Описание");
  }, [product]);

  useEffect(() => {
    setImageIndex(0);
  }, [variant?.id, product.id]);

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
            <button className={isFavorite(product.id) ? "active" : ""} onClick={() => toggleFavorite({ id: product.id, name: product.name, price: variant?.price ?? minPrice(product), image })}>
              <Heart />
            </button>
          </div>
          {gallery.length > 1 && (
            <div className="thumbnails">
              {gallery.map((src, index) => (
                <button type="button" className={imageIndex === index ? "active" : ""} onClick={() => setImageIndex(index)} key={src}>
                  <Image src={src} alt="" fill sizes="72px" unoptimized />
                </button>
              ))}
            </div>
          )}
        </div>
        <div className="product-info">
          <h1>{product.name}</h1>
          {comingSoon ? <strong className="detail-price">Скоро в каталоге</strong> : <strong className="detail-price">{formatPrice(variant.price)}</strong>}
          {variant?.wbUrl && (
            <p className="rating">★★★★★ <a href={variant.wbUrl} target="_blank" rel="noopener noreferrer">Отзывы на Wildberries</a></p>
          )}
          {product.variants.length > 1 && (
            <div className="option">
              <label>{product.variantKind === "set" ? "Комплектация" : "Размер"}</label>
              <div>{product.variants.map(item => <button className={variant.id === item.id ? "selected" : ""} onClick={() => setVariantId(item.id)} key={item.id}>{item.label}</button>)}</div>
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
              <Button onClick={() => { addToCart(toCartItem(product, variant), qty); setAdded(true); }}>{added ? "Товар в корзине" : "В корзину"} <ShoppingBag /></Button>
            </div>
          )}
          <div className="mini-benefits"><span><PackageCheck />Быстрая доставка</span><span><Sparkles />Ручная работа</span><span><Truck />Возможен возврат</span></div>
        </div>
      </section>
      <section className={`shell product-description${activeTab === "Отзывы" ? " reviews-open" : ""}`}>
        <div className="description-copy">
          <div className="description-tabs">{tabs.map(tab => <button className={activeTab === tab ? "active" : ""} onClick={() => setActiveTab(tab)} key={tab}>{tab}</button>)}</div>
          {activeTab === "Описание" && (
            <div className="tab-panel">
              {product.description.split("\n\n").map(paragraph => <p key={paragraph}>{paragraph}</p>)}
            </div>
          )}
          {activeTab === "Характеристики" && (
            <div className="spec-table">{specRows(product, variant).map(([key, value]) => <div key={key}><span>{key}</span><b>{value}</b></div>)}</div>
          )}
          {activeTab === "Отзывы" && (
            <div className="product-reviews">
              {reviews.length > 0 ? (
                <>
                  {reviews.map(review => (
                    <article key={`${review.author}-${review.date}`}>
                      <div>
                        <b>{review.author}</b>
                        <span>{"★".repeat(review.rating)}</span>
                      </div>
                      <p>{review.text}</p>
                      <small>{review.date} · Wildberries</small>
                    </article>
                  ))}
                  {variant?.wbUrl && (
                    <a className="wb-reviews-link" href={variant.wbUrl} target="_blank" rel="noopener noreferrer">
                      Все отзывы на Wildberries <ExternalLink />
                    </a>
                  )}
                </>
              ) : (
                <p>Отзывы появятся вместе с коллекцией.</p>
              )}
            </div>
          )}
        </div>
        {activeTab !== "Отзывы" && (
          <figure className="description-photo">
            <Image src={gallery[1] ?? gallery[0] ?? product.image} alt={product.name} fill sizes="(max-width: 700px) 100vw, 420px" unoptimized />
          </figure>
        )}
      </section>
      {related.length > 0 && <section className="shell section"><SectionTitle>Похожие товары</SectionTitle><div className="product-grid">{related.map(item => <ProductCard key={item.id} product={item} />)}</div></section>}
      {bundle.length > 0 && (
        <section className="shell bundle">
          <SectionTitle>С этим товаром покупают</SectionTitle>
          <div className="bundle-row">
            {bundleItems.map((item, i) => <div className="bundle-product" key={item.id}><Image src={item.image} alt={item.name} width={110} height={110} /><span>{item.name}<b>{formatPrice(minPrice(item))}</b></span>{i < bundleItems.length - 1 && <Plus />}</div>)}
            <div className="bundle-total"><span>Итого</span><strong>{formatPrice(bundleItems.reduce((sum, item) => sum + minPrice(item), 0))}</strong><Button onClick={() => bundleItems.forEach(item => addToCart(toCartItem(item)))}>Добавить всё в корзину</Button></div>
          </div>
        </section>
      )}
    </Page>
  );
}

export function AboutPage() {
  return (
    <Page>
      <section className="page-hero about-hero"><Image src="/images/hero.png" alt="" fill priority /><div className="hero-shade" /><div className="shell"><p>Главная / О компании</p><h1>О компании</h1><span>Создаём уют из натуральных материалов</span></div></section>
      <section className="shell about-intro"><div><p className="eyebrow">Мэри Джут — это</p><h2>Семейная мастерская по производству интерьерных изделий из джута</h2><p>Мы верим, что у каждого дома есть характер. Наши изделия помогают наполнить пространство теплом натуральных материалов и живой энергией ручной работы.</p><div className="about-points"><span><Leaf />Ручная работа</span><span><Sparkles />Собственное производство</span><span><PackageCheck />Натуральные материалы</span><span><Heart />Любовь к своему делу</span></div></div><Image src="/images/craftswoman.png" alt="Мастер плетёт корзину из джута" width={480} height={620} /></section>
      <section className="shell founder"><Image src="/images/basket.png" alt="Корзина ручной работы" width={460} height={460} /><div><p className="eyebrow">Наша история</p><h2>Начиналось всё с желания создавать красивые и нужные вещи</h2><p>Первая корзина появилась как вещь для собственного дома. Затем были ковры, панно и десятки экспериментов с формой. Сегодня каждое изделие по-прежнему проходит через руки мастера.</p><Button render={<Link href="/catalog" />}>Наши работы <ArrowRight /></Button></div></section>
      <section className="stats"><div className="shell"><span><b>5 лет</b>создаём уют</span><span><b>10 000+</b>изделий нашли дом</span><span><b>100%</b>ручная работа</span></div></section>
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
        <div className="info-main"><p className="eyebrow">Способы получения</p><h2>Выберите удобную доставку</h2><div className="info-card-grid">
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
      <InfoHero title="Оплата" subtitle="Безопасные и привычные способы оплаты" />
      <section className="shell payment-section"><div><p className="eyebrow">Оплата заказа</p><h2>Выберите удобный способ</h2><p>После оформления вы перейдёте на защищённую страницу оплаты. Мы не храним данные банковских карт.</p></div><div className="payment-grid">
        <article><CreditCard /><h3>Банковской картой</h3><p>МИР, Visa и Mastercard российских банков.</p><span>Без комиссии</span></article>
        <article><WalletCards /><h3>Через СБП</h3><p>Оплата по QR-коду в приложении вашего банка.</p><span>Мгновенно</span></article>
        <article><Banknote /><h3>Индивидуальный заказ</h3><p>Предоплата после согласования параметров с мастером.</p><span>По ссылке</span></article>
      </div></section>
      <section className="shell payment-steps"><h2>Как происходит оплата</h2><div>{["Добавьте изделия в корзину", "Заполните данные получателя", "Оплатите заказ безопасным способом", "Получите подтверждение на e-mail"].map((text, i) => <span key={text}><b>0{i + 1}</b>{text}</span>)}</div></section>
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
        <div className="contact-details"><p className="eyebrow">Связаться с нами</p><h2>Давайте обсудим ваш будущий уют</h2><p>Расскажем об изделиях, поможем подобрать размер и рассчитаем индивидуальный заказ.</p><div><a href="tel:+79278000000"><span><MessageCircle /></span><b>+7 (927) 800-00-00<small>Ежедневно с 9:00 до 20:00</small></b></a><a href="mailto:hello@mary-jute.ru"><span><Mail /></span><b>hello@mary-jute.ru<small>Ответим в течение рабочего дня</small></b></a><p><span><MapPin /></span><b>Ульяновская область<small>Мастерская работает без шоурума</small></b></p></div><div className="contact-socials"><a href="#">Telegram</a><a href="#">ВКонтакте</a><a href="#">MAX</a></div></div>
        <form className="contact-form" onSubmit={submitContact}><span>Напишите нам</span><h3>Ответим на ваш вопрос</h3><label>Ваше имя<Input name="name" required placeholder="Мария" /></label><label>Телефон<Input name="phone" required type="tel" placeholder="+7 (___) ___-__-__" /></label><label>E-mail<Input name="email" type="email" placeholder="mail@example.ru" /></label><label>Сообщение<textarea name="message" required placeholder="Расскажите, чем мы можем помочь" /></label><label className="calc-check"><Checkbox defaultChecked />Согласен с политикой конфиденциальности</label><Button type="submit" disabled={sending || sent}>{sent ? "Сообщение отправлено" : sending ? "Отправляем..." : "Отправить сообщение"} <ArrowRight /></Button></form>
      </section>
    </Page>
  );
}
