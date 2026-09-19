"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowRight,
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
  { name: "Декор", image: "/images/hero.png", href: "/catalog" },
];

function Logo() {
  return (
    <Link href="/" className="brand" aria-label="Мэри Джут — главная">
      <span className="brand-mark">✦</span>
      <span>Мэри Джут</span>
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
      <div className="shell footer-grid">
        <div>
          <Logo />
          <p>Интерьерные изделия из джута,<br />созданные вручную с душой.</p>
        </div>
        <div><h4>Покупателям</h4><Link href="/catalog">Каталог</Link><a href="#delivery">Доставка</a><a href="#payment">Оплата</a></div>
        <div><h4>О компании</h4><Link href="/about">Наша история</Link><a href="#">Отзывы</a><a href="#">Контакты</a></div>
        <div><h4>Будьте в курсе новинок и акций</h4><div className="subscribe"><Input placeholder="Ваш e-mail" /><Button>Подписаться</Button></div><p>Telegram · VK · MAX</p></div>
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
      </Link>
      <button className={`heart ${liked ? "active" : ""}`} onClick={() => setLiked(!liked)} aria-label="Добавить в избранное"><Heart /></button>
      <Link href="/product"><h3>{product.name}</h3></Link>
      <div className="product-bottom"><strong>{product.price}</strong><button onClick={() => setAdded(true)}><span>{added ? "Добавлено" : "В корзину"}</span><ShoppingBag /></button></div>
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
  return (
    <Page>
      <section className="hero">
        <Image src="/images/hero.png" alt="Уютная гостиная с джутовым ковром" fill priority sizes="100vw" />
        <div className="hero-shade" />
        <div className="shell hero-content">
          <p>Интерьерные изделия из джута</p>
          <h1>Природный уют<br />в вашем доме</h1>
          <span>Ковры, корзины, панно и декор ручной работы<br />от российского производителя</span>
          <Button className="light-button" render={<Link href="/catalog" />}>Перейти в каталог <ArrowRight /></Button>
        </div>
      </section>
      <Benefits />
      <section className="shell section">
        <SectionTitle link="/catalog">Популярные категории</SectionTitle>
        <div className="category-grid">
          {categories.map((cat) => <Link href={cat.href} className="category-card" key={cat.name}><Image src={cat.image} alt={cat.name} fill sizes="25vw" /><span>{cat.name}</span></Link>)}
        </div>
      </section>
      <section className="shell story-banner">
        <Image src="/images/hero.png" alt="" fill sizes="100vw" />
        <div className="story-copy"><p>Эксклюзивные изделия для вашего пространства</p><span>Каждое изделие мы создаём вручную — от первого витка до последнего стежка.</span><Button render={<Link href="/about" />}>Наша история</Button></div>
      </section>
      <section className="shell section">
        <SectionTitle link="/catalog">Популярные товары</SectionTitle>
        <div className="product-grid">{products.map((p) => <ProductCard key={p.name} product={p} />)}</div>
      </section>
      <section className="shell promo">
        <Image src="/images/hero.png" alt="" fill sizes="100vw" />
        <div><p>Наши изделия рождаются<br />с любовью к деталям</p><span>Посмотрите, как создаётся натуральный уют</span><Button variant="secondary">Смотреть</Button></div>
      </section>
      <section className="shell section reviews">
        <SectionTitle>Отзывы</SectionTitle>
        <div className="review-grid">
          {[
            ["Елена П.", "Ковёр великолепный — плотный, аккуратный и очень уютный. Видно, что сделан руками."],
            ["Ольга К.", "Корзина идеально вписалась в интерьер. Упаковка бережная, доставка быстрая."],
            ["Наталья С.", "Заказывала нестандартный размер. Всё подробно согласовали, результат превзошёл ожидания."],
          ].map(([name, text]) => <article key={name}><div className="stars">★★★★★</div><p>{text}</p><b>{name}</b></article>)}
        </div>
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
            <FilterGroup title="Цвет" values={["Натуральный", "Карамельный", "Зелёный"]} />
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
