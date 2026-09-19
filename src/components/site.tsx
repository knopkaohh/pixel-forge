"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronDown,
  Heart,
  Leaf,
  Menu,
  Minus,
  PackageCheck,
  Plus,
  Search,
  ShoppingBag,
  Sparkles,
  Truck,
  UserRound,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

const products = [
  { name: "Ковер джутовый круглый", price: "7 990 ₽", image: "/images/rug.png" },
  { name: "Корзина с ручками", price: "2 490 ₽", image: "/images/basket.png" },
  { name: "Панно «Солнце»", price: "3 990 ₽", image: "/images/wall-art.png" },
  { name: "Ковер натуральный", price: "9 990 ₽", image: "/images/rug.png" },
];

const categories = [
  { name: "Ковры", image: "/images/rug.png", href: "/catalog" },
  { name: "Корзины", image: "/images/basket.png", href: "/catalog" },
  { name: "Панно", image: "/images/wall-art.png", href: "/catalog" },
  { name: "Декор", image: "/images/lamp.png", href: "/catalog" },
];

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
  const nav = [
    ["Каталог", "/catalog"],
    ["О нас", "/about"],
    ["Доставка", "/#delivery"],
    ["Оплата", "/#payment"],
    ["Контакты", "/#contacts"],
  ];

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
            <button aria-label="Избранное"><Heart /></button>
            <button aria-label="Личный кабинет"><UserRound /></button>
            <button className="bag" aria-label="Корзина"><ShoppingBag /><i>1</i></button>
            <button className="mobile-menu" onClick={() => setOpen(true)} aria-label="Открыть меню"><Menu /></button>
          </div>
        </div>
      </header>
      {open && (
        <div className="mobile-drawer">
          <button onClick={() => setOpen(false)} aria-label="Закрыть меню"><X /></button>
          <Logo />
          {nav.map(([label, href]) => <Link key={label} href={href} onClick={() => setOpen(false)}>{label}</Link>)}
          <a href="tel:+79278000000">+7 (927) 800-00-00</a>
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
        <div><h4>Покупателям</h4><Link href="/catalog">Каталог</Link><a href="#delivery">Доставка и оплата</a><a href="#">Возврат и гарантия</a><a href="#">Уход за изделиями</a></div>
        <div><h4>О мастерской</h4><Link href="/about">О компании</Link><a href="#">Отзывы</a><a href="#">Вопросы и ответы</a><a href="#">Контакты</a></div>
        <div className="footer-contact"><h4>Связаться с нами</h4><a href="tel:+79278000000">+7 (927) 800-00-00</a><a href="mailto:hello@mary-jute.ru">hello@mary-jute.ru</a><p>Ежедневно с 9:00 до 20:00<br />Ульяновская область</p><Button variant="outline">Написать нам</Button></div>
      </div>
      <div className="shell footer-bottom"><span>© 2026 Мэри Джут</span><span>Политика конфиденциальности</span></div>
    </footer>
  );
}

function Page({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

function SectionTitle({ children, link }: { children: React.ReactNode; link?: string }) {
  return <div className="section-heading"><h2>{children}</h2>{link && <Link href={link}>Смотреть все <ArrowRight /></Link>}</div>;
}

function ProductCard({ product = products[0] }: { product?: typeof products[number] }) {
  const [liked, setLiked] = useState(false);
  const [added, setAdded] = useState(false);
  return (
    <article className="product-card">
      <Link href="/product" className="product-image">
        <Image src={product.image} alt={product.name} fill sizes="(max-width: 700px) 50vw, 25vw" />
        <span className="product-badge">Ручная работа</span>
      </Link>
      <button className={`heart ${liked ? "active" : ""}`} onClick={() => setLiked(!liked)} aria-label="Добавить в избранное"><Heart /></button>
      <div className="product-copy">
        <div className="product-rating"><span>★★★★★</span><small>5.0</small></div>
        <Link href="/product"><h3>{product.name}</h3></Link>
        <p>Натуральный джут · в наличии</p>
        <div className="product-bottom"><strong>{product.price}</strong><div className="mini-swatches"><i /><i /><i /></div><button onClick={() => setAdded(true)}><span>{added ? "Добавлено" : "В корзину"}</span><ShoppingBag /></button></div>
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
  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % slides.length), 6500);
    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <Page>
      <section className="hero">
        {slides.map((item, i) => <Image key={item.image} className={slide === i ? "active" : ""} src={item.image} alt="Интерьер с изделиями из джута" fill priority={i === 0} sizes="100vw" />)}
        <div className="hero-shade" />
        <div className="shell hero-content">
          <p>{slides[slide].eyebrow}</p>
          <h1>{slides[slide].title}</h1>
          <span>{slides[slide].text}<br />от российского производителя</span>
          <Button className="light-button" render={<Link href="/catalog" />}>Перейти в каталог <ArrowRight /></Button>
        </div>
        <div className="hero-controls shell">
          <div>{slides.map((_, i) => <button key={i} className={slide === i ? "active" : ""} onClick={() => setSlide(i)} aria-label={`Слайд ${i + 1}`} />)}</div>
          <span><button onClick={() => setSlide((slide - 1 + slides.length) % slides.length)} aria-label="Предыдущий слайд"><ArrowLeft /></button><b>0{slide + 1}</b><i>/</i><small>0{slides.length}</small><button onClick={() => setSlide((slide + 1) % slides.length)} aria-label="Следующий слайд"><ArrowRight /></button></span>
        </div>
        <div className="hero-note"><Leaf /><span>100% натуральный<br /><b>джут</b></span></div>
      </section>
      <Benefits />
      <section className="shell section">
        <SectionTitle link="/catalog">Популярные категории</SectionTitle>
        <div className="category-grid">
          {categories.map((cat) => <Link href={cat.href} className="category-card" key={cat.name}><div className="category-image"><Image src={cat.image} alt={cat.name} fill sizes="25vw" /><i><ArrowRight /></i></div><span>{cat.name}<small>Смотреть коллекцию</small></span></Link>)}
        </div>
      </section>
      <section className="shell collection-showcase">
        <div className="collection-main"><Image src="/images/hero-dining.png" alt="Коллекция джутовых ковров" fill /><div><span>Новая коллекция</span><h2>Дом, в котором<br />хочется остаться</h2><Link href="/catalog">Смотреть коллекцию <ArrowRight /></Link></div></div>
        <Link href="/catalog" className="collection-small"><Image src="/images/lamp.png" alt="Джутовые светильники" fill /><span>Свет и декор<small>12 изделий</small></span></Link>
      </section>
      <section className="shell story-banner">
        <Image src="/images/hero.png" alt="" fill sizes="100vw" />
        <div className="story-copy"><em>Индивидуальное изготовление</em><p>Эксклюзивные изделия для вашего пространства</p><span>Подберём форму, размер и оттенок. Каждое изделие создаём вручную — от первого витка до последнего стежка.</span><Button render={<Link href="/calculator" />}>Рассчитать стоимость <ArrowRight /></Button></div>
      </section>
      <section className="shell section">
        <SectionTitle link="/catalog">Популярные товары</SectionTitle>
        <div className="product-grid">{products.map((p) => <ProductCard key={p.name} product={p} />)}</div>
      </section>
      <section className="shell promo">
        <Image src="/images/process.png" alt="Процесс создания изделий из джута" fill sizes="100vw" />
        <div><small>За кулисами мастерской</small><p>Наши изделия рождаются<br />с любовью к деталям</p><span>Посмотрите, как создаётся натуральный уют</span><Button variant="secondary">Смотреть историю <ArrowRight /></Button></div>
        <button className="play-button" aria-label="Смотреть видео">▶</button>
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
        <div className="faq-preview"><span>Помогаем с выбором</span><h2>Частые вопросы</h2>{["Как ухаживать за изделиями?", "Можно ли заказать свой размер?", "Почему новое изделие имеет запах?"].map((q, i) => <button key={q}><b>0{i + 1}</b>{q}<Plus /></button>)}<Link href="#">Все вопросы <ArrowRight /></Link></div>
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

export function CatalogPage() {
  const [category, setCategory] = useState("Все");
  const tabs = ["Все", "Ковры", "Корзины", "Панно", "Декор"];
  return (
    <Page>
      <section className="page-hero compact">
        <Image src="/images/hero.png" alt="" fill priority />
        <div className="hero-shade" /><div className="shell"><p>Главная / Каталог</p><h1>Каталог</h1><span>Натуральные материалы, ручная работа<br />и тепло вашего дома</span></div>
      </section>
      <section className="shell catalog-section">
        <div className="catalog-tabs">{tabs.map(t => <button key={t} onClick={() => setCategory(t)} className={category === t ? "selected" : ""}>{t}</button>)}</div>
        <div className="catalog-layout">
          <aside className="filters">
            <div className="catalog-search"><h4>Поиск</h4><div><Input placeholder="Найти изделие" /><Search /></div></div>
            <div className="price-filter"><h4>Цена</h4><div><Input defaultValue="1 000" /><span>—</span><Input defaultValue="15 000" /></div><input type="range" min="1000" max="15000" defaultValue="10000" /></div>
            <FilterGroup title="Размер" values={["до 60 см", "60–100 см", "100–150 см", "более 150 см"]} />
            <div className="filter-group swatch-filter"><h4>Цвет<ChevronDown /></h4><div>{["#d5bd91", "#b17c43", "#6f5b42", "#204b31", "#eee9de"].map((value, i) => <button className={i === 0 ? "selected" : ""} style={{background:value}} key={value} aria-label={`Цвет ${i + 1}`}>{i === 0 && <Check />}</button>)}</div></div>
            <FilterGroup title="Материал" values={["Джут", "Хлопок", "Смешанный"]} />
          </aside>
          <div className="catalog-content">
            <div className="catalog-toolbar"><span>Найдено: 24 товара</span><button>По популярности <ChevronDown /></button></div>
            <div className="product-grid catalog-products">
              {[...products, ...products].map((p, i) => <ProductCard key={`${p.name}-${i}`} product={p} />)}
            </div>
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
  const price = useMemo(() => {
    const diameter = shape === "Овал" ? (size + length) / 2 : size;
    return Math.round((diameter * diameter * 0.49 + rows * 650) / 100) * 100;
  }, [shape, size, length, rows]);

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
            <div className="field-grid"><label>Ширина / диаметр<Input type="number" value={size} onChange={e => setSize(Number(e.target.value))} min={40} max={300} /></label>{shape === "Овал" && <label>Длина<Input type="number" value={length} onChange={e => setLength(Number(e.target.value))} min={60} max={400} /></label>}</div>
            <h3>Количество рядов с узором</h3>
            <div className="counter"><button onClick={() => setRows(Math.max(0, rows - 1))}><Minus /></button><span>{rows}</span><button onClick={() => setRows(Math.min(8, rows + 1))}><Plus /></button></div>
            <label className="calc-check"><Checkbox defaultChecked />Я согласен с отклонением готового изделия ± 2 см</label>
          </div>
          <aside className="estimate-card">
            <p>Примерная стоимость</p><strong>{price.toLocaleString("ru-RU")} ₽</strong><span>Точная стоимость рассчитывается<br />после согласования с мастером</span><Button>Отправить заявку <ArrowRight /></Button><Image src="/images/basket.png" alt="Джутовая корзина" width={420} height={420} />
          </aside>
        </div>
      </section>
      <section className="shell how"><h2>Как это работает?</h2><div>{["Выберите тип и форму изделия", "Укажите желаемые размеры", "Получите расчёт и оставьте заявку"].map((t, i) => <article key={t}><b>0{i + 1}</b><span>{t}</span></article>)}</div><p>Толщина изделия — 8 мм. Для овала расчёт ведётся по усреднённому диаметру.</p></section>
    </Page>
  );
}

export function ProductPage() {
  const [size, setSize] = useState("80 см");
  const [color, setColor] = useState(0);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const thumbs = ["/images/rug.png", "/images/hero.png", "/images/rug.png", "/images/hero.png"];
  const [image, setImage] = useState(thumbs[0]);
  return (
    <Page>
      <div className="shell breadcrumb">Главная / Ковры / Ковер джутовый круглый</div>
      <section className="shell product-detail">
        <div className="gallery"><div className="thumbnails">{thumbs.map((src, i) => <button className={image === src ? "active" : ""} onClick={() => setImage(src)} key={i}><Image src={src} alt="" fill /></button>)}</div><div className="main-image"><Image src={image} alt="Ковер джутовый круглый" fill priority /><button><Heart /></button></div></div>
        <div className="product-info">
          <h1>Ковер джутовый<br />круглый</h1><strong className="detail-price">7 990 ₽</strong><div className="rating">★★★★★ <span>24 отзыва</span></div>
          <div className="option"><label>Размер</label><div>{["60 см", "80 см", "100 см", "150 см"].map(v => <button className={size === v ? "selected" : ""} onClick={() => setSize(v)} key={v}>{v}</button>)}</div></div>
          <div className="option color-option"><label>Цвет</label><div>{["#d9c49c", "#a97a42", "#5c513b", "#173e29"].map((v, i) => <button className={color === i ? "selected" : ""} style={{background:v}} onClick={() => setColor(i)} key={v} aria-label={`Цвет ${i + 1}`} />)}</div></div>
          <div className="buy-row"><div className="counter"><button onClick={() => setQty(Math.max(1, qty - 1))}><Minus /></button><span>{qty}</span><button onClick={() => setQty(qty + 1)}><Plus /></button></div><Button onClick={() => setAdded(true)}>{added ? "Товар в корзине" : "В корзину"} <ShoppingBag /></Button></div>
          <div className="mini-benefits"><span><PackageCheck />Быстрая доставка</span><span><Sparkles />Ручная работа</span><span><Truck />Возможен возврат</span></div>
        </div>
      </section>
      <section className="shell product-description">
        <div className="description-copy"><div className="description-tabs"><button className="active">Описание</button><button>Характеристики</button><button>Отзывы (24)</button></div><p>Натуральный джутовый ковёр ручной работы. Прочное плетение и выразительная фактура делают его тёплым акцентом в интерьере гостиной, спальни или террасы.</p><ul><li>Ручная работа</li><li>Экологичный материал</li><li>Подходит для тёплого пола</li><li>Легко поддерживать в чистоте</li></ul></div>
        <Image src="/images/hero.png" alt="Ковер в интерьере" width={520} height={420} />
      </section>
      <section className="shell section"><SectionTitle>Похожие товары</SectionTitle><div className="product-grid">{products.map(p => <ProductCard key={p.name} product={p} />)}</div></section>
      <section className="shell bundle">
        <SectionTitle>С этим товаром покупают</SectionTitle>
        <div className="bundle-row">
          {products.slice(0, 3).map((p, i) => <div className="bundle-product" key={p.name}><Image src={p.image} alt={p.name} width={110} height={110} /><span>{p.name}<b>{p.price}</b></span>{i < 2 && <Plus />}</div>)}
          <div className="bundle-total"><span>Итого</span><strong>14 470 ₽</strong><Button>Добавить всё в корзину</Button></div>
        </div>
      </section>
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
