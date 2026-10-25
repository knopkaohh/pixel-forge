"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Heart, Leaf, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Header, Footer } from "@/components/site";
import { Button } from "@/components/ui/button";
import { privacyPolicy, userAgreement, type LegalBlock } from "@/lib/legal";

function Page({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

function Hero({ title, text }: { title: string; text: string }) {
  return <section className="page-hero content-hero"><Image src="/images/hero-dining.png" alt="" fill priority /><div className="hero-shade" /><div className="shell"><p>Главная / {title}</p><h1>{title}</h1><span>{text}</span></div></section>;
}

const faqs = [
  ["Из какого материала изготовлены изделия?", "Мы используем натуральный джут и, в отдельных коллекциях, сочетание джута с хлопком. Состав всегда указан в карточке товара."],
  ["Как ухаживать за изделиями?", "Рекомендуем регулярную сухую чистку мягкой щёткой или пылесосом на небольшой мощности. Не замачивайте изделие полностью."],
  ["Почему новое изделие имеет запах?", "Лёгкий растительный аромат характерен для натурального джута и самостоятельно исчезает после проветривания в течение нескольких дней."],
  ["Можно ли изготовить изделие по индивидуальным размерам?", "Да. Сроки и условия — на странице индивидуального изготовления. В калькуляторе укажите форму и размеры, мастер подтвердит итог до начала работы."],
  ["Допустимо ли отклонение в размере?", "Так как каждое изделие создаётся вручную, возможное отклонение составляет до ±2 см."],
  ["Можно ли использовать ковёр на тёплом полу?", "Да, джутовые ковры подходят для тёплого пола при умеренной температуре нагрева."],
];

export function FaqPage() {
  const [open, setOpen] = useState(0);
  return <Page><Hero title="Вопросы и ответы" text="Собрали всё важное о материалах, заказе и уходе" /><section className="shell faq-page"><div><p className="eyebrow">Помощь покупателю</p><h2>Частые вопросы</h2>{faqs.map(([question, answer], index) => <article className={open === index ? "open" : ""} key={question}><button onClick={() => setOpen(open === index ? -1 : index)}><span>0{index + 1}</span><b>{question}</b><ChevronDown /></button>{open === index && <p>{answer}</p>}</article>)}</div><aside><Leaf /><h3>Не нашли ответ?</h3><p>Напишите нам — поможем с выбором и расскажем об изделиях подробнее.</p><Button render={<Link href="/contacts" />}>Задать вопрос <ArrowRight /></Button></aside></section></Page>;
}

const infoPages = {
  care: {
    title: "Уход за изделиями",
    text: "Простые рекомендации, которые сохранят красоту натурального джута",
    icon: <Sparkles />,
    sections: [
      ["Регулярная чистка", "Используйте мягкую щётку или пылесос на минимальной мощности без вращающейся турбощётки."],
      ["Удаление пятен", "Сразу промокните влагу сухой салфеткой. Для локальной чистки используйте слегка влажную ткань без агрессивных средств."],
      ["Хранение", "Храните изделие в сухом проветриваемом месте, свернув в рулон лицевой стороной наружу."],
    ],
  },
};

export function InformationPage({ type }: { type: keyof typeof infoPages }) {
  const data = infoPages[type];
  return <Page><Hero title={data.title} text={data.text} /><section className="shell editorial-info"><div className="editorial-icon">{data.icon}</div>{data.sections.map(([title, text], i) => <article key={title}><b>0{i + 1}</b><h2>{title}</h2><p>{text}</p></article>)}<div className="editorial-cta"><h3>Остались вопросы?</h3><Button render={<Link href="/contacts" />}>Связаться с нами</Button></div></section></Page>;
}

const warrantyPromises = [
  [ShieldCheck, "Проверка перед отправкой", "Смотрим форму, плотность плетения и обработку края. С производства уезжает только то, что готовы поставить в свой дом."],
  [Leaf, "Натуральный джут", "Работаем с природным волокном, без синтетического ворса. Лёгкий растительный запах — норма, он уходит после проветривания."],
  [Sparkles, "Собственное производство", "Полный цикл в России: от каната до готовой вещи. Знаем, кто плёл, и отвечаем за результат, а не за чужой конвейер."],
  [PackageCheck, "Бережная упаковка", "Укладываем так, чтобы изделие доехало таким же, каким ушло с производства. Если перевозка подвела — разберёмся."],
  [Heart, "30 дней на недостаток", "Нашли производственный дефект — напишите в течение месяца после получения. Предложим решение: исправление, замена или возврат."],
  [ShieldCheck, "Честно про ручную работу", "Небольшие отличия оттенка, фактуры и размера до ±2 см — характер джута и ручного плетения, а не брак."],
] as const;

export function WarrantyPage() {
  return (
    <Page>
      <Hero title="Гарантия качества" text="Отвечаем за материал, плетение и то, как изделие приедет к вам" />
      <section className="shell about-intro">
        <div>
          <p className="eyebrow">Наше обещание</p>
          <h2>Качество, за которое не стыдно отвечать</h2>
          <div className="about-copy">
            <p>Мэри Джут — собственное производство интерьерных изделий из джута. Мы не прячемся за чужой фабрикой и не обещаем невозможного: обещаем аккуратную работу, честный материал и поддержку после покупки.</p>
            <p>Каждая вещь проходит через руки мастера и финальный осмотр. Если с изделием что-то не так по нашей вине — это наша ответственность. Если джут живёт своей природной жизнью — расскажем, как это отличить от брака.</p>
          </div>
        </div>
        <Image src="/images/about/craft.jpg" alt="Джутовый ковёр ручной работы" width={480} height={640} unoptimized />
      </section>
      <section className="shell warranty-promises">
        {warrantyPromises.map(([Icon, title, text]) => (
          <article key={title}>
            <Icon />
            <h3>{title}</h3>
            <p>{text}</p>
          </article>
        ))}
      </section>
      <section className="shell warranty-split">
        <article>
          <p className="eyebrow">Гарантийный случай</p>
          <h2>Когда мы всё исправим</h2>
          <ul>
            <li>Ошибка размера больше допустимых ±2 см</li>
            <li>Распущенный край, слабый узел, дыра в плетении</li>
            <li>Изделие приехало повреждённым при целой претензии к перевозке</li>
            <li>Отправили не ту модель или не тот размер</li>
          </ul>
        </article>
        <article>
          <p className="eyebrow">Характер материала</p>
          <h2>Что не считается дефектом</h2>
          <ul>
            <li>Небольшой разный тон джута в пределах натурального волокна</li>
            <li>Живая фактура каната и лёгкая асимметрия ручной работы</li>
            <li>Растительный запах в первые дни, который выветривается</li>
            <li>Следы естественного износа при неправильном уходе</li>
          </ul>
        </article>
      </section>
      <section className="shell warranty-steps">
        <div>
          <p className="eyebrow">Если что-то не так</p>
          <h2>Три шага — и мы на связи</h2>
        </div>
        <ol>
          <li><b>Напишите нам</b><span>В течение 30 дней после получения: почта, форма на сайте или сообщение в Telegram и ВКонтакте.</span></li>
          <li><b>Пришлите фото</b><span>Изделие целиком, крупный план участка и упаковку — так быстрее понять, производство это или дорога.</span></li>
          <li><b>Согласуем решение</b><span>Замена, доработка или возврат. Не оставляем вас один на один с канатом и вопросами.</span></li>
        </ol>
      </section>
      <section className="shell editorial-cta warranty-cta">
        <h3>Остались вопросы по качеству?</h3>
        <div className="about-actions">
          <Button render={<Link href="/contacts" />}>Написать нам <ArrowRight /></Button>
          <Button variant="outline" render={<Link href="/care" />}>Уход за изделиями</Button>
        </div>
      </section>
    </Page>
  );
}

export function PromotionsPage() {
  return <Page><Hero title="Акции" text="Две скидки, которые действуют сейчас" /><section className="shell promotions-grid"><article><Image src="/images/hero.png" alt="" fill /><div><span>На заказ</span><h2>Скидка 10%</h2><p>Если сумма заказа от 15 000 ₽.</p><Button render={<Link href="/catalog" />}>Выбрать изделия</Button></div></article><article><Image src="/images/basket.png" alt="" fill /><div><span>Из мастерской</span><h2>Скидка 5%</h2><p>Если забираете заказ самовывозом в Ульяновске.</p><Button render={<Link href="/delivery" />}>Как забрать</Button></div></article></section></Page>;
}

export function ReturnsPage() {
  return (
    <Page>
      <Hero title="Возврат и обмен" text="Готовую вещь из каталога можно вернуть, пока она новая. Ковёр по вашим меркам — только если брак наш." />
      <section className="shell returns-intro">
        <p className="eyebrow">Покупателю</p>
        <h2>Когда отказ ещё возможен</h2>
        <p>Отказ от готового изделия не из перечня товаров, которые нельзя обменять даже при нормальном качестве. Этот перечень утверждён постановлением Правительства РФ № 2463. Всё, что ниже, относится к обычным позициям каталога.</p>
      </section>
      <section className="shell warranty-split">
        <article>
          <p className="eyebrow">Сроки</p>
          <h2>До какого дня</h2>
          <ul>
            <li>Пока вещь вам ещё не передали — отказаться можно в любой момент, заказ просто снимаем.</li>
            <li>Если привёз курьер — семь дней с получения. День вручения в этот срок не входит.</li>
            <li>Если забирали сами — четырнадцать дней, и день покупки тоже не считаем.</li>
          </ul>
        </article>
        <article>
          <p className="eyebrow">Состояние</p>
          <h2>Какой должна приехать обратно</h2>
          <ul>
            <li>Ею не пользовались: не стелили, не носили, не стирали.</li>
            <li>Комплект целый, вид и свойства на месте.</li>
            <li>Ярлыки, пломбы и этикетки не срезаны.</li>
            <li>Упаковка сохранена, если её можно было открыть, не порвав.</li>
          </ul>
        </article>
      </section>
      <section className="shell returns-callout">
        <h2>Индивидуальный заказ</h2>
        <p>Вещь, сплетённую по вашим размерам и без брака, вернуть и обменять нельзя: она сделана только для вас. Если недостаток с производства — пишите, это гарантийный случай. <Link href="/warranty">Как мы разбираем брак</Link>.</p>
      </section>
      <section className="shell warranty-steps">
        <div>
          <p className="eyebrow">Как оформить</p>
          <h2>Три шага</h2>
        </div>
        <ol>
          <li><b>Напишите нам</b><span>После получения зайдите в контакты на сайте и попросите бланк заявления на возврат.</span></li>
          <li><b>Сложите всё вместе</b><span>Изделие и то, что к нему прилагалось, в ту же упаковку, если она цела.</span></li>
          <li><b>Передайте обратно</b><span>Отнесите в пункт, где забирали, или отправьте Почтой России за свой счёт и пришлите нам трек-номер.</span></li>
        </ol>
      </section>
      <section className="shell warranty-split returns-money">
        <article>
          <p className="eyebrow">Деньги</p>
          <h2>Когда вернём оплату</h2>
          <ul>
            <li>В течение десяти дней после того, как получим изделие и заявление.</li>
            <li>Из суммы вычитаем наши расходы на обратную доставку.</li>
            <li>Если качество ненадлежащее и виноваты мы — дорогу обратно оплачиваем сами.</li>
          </ul>
        </article>
        <article>
          <p className="eyebrow">Если не сошлись</p>
          <h2>Куда идти дальше</h2>
          <ul>
            <li>Сохраните переписку, чеки и трек.</li>
            <li>Сначала официальная претензия нам — ответим по ней.</li>
            <li>Если договориться не вышло, дальше Роспотребнадзор или суд.</li>
            <li>Перед отправкой загляните в карточку товара: по отдельной модели там может быть уточнение.</li>
          </ul>
        </article>
      </section>
      <section className="shell editorial-cta warranty-cta">
        <h3>Нужен бланк или совет?</h3>
        <div className="about-actions">
          <Button render={<Link href="/contacts" />}>Написать нам <ArrowRight /></Button>
          <Button variant="outline" render={<Link href="/warranty" />}>Гарантия качества</Button>
        </div>
      </section>
    </Page>
  );
}

export function CertificatesPage() {
  return <Page><Hero title="Сертификаты" text="Документы и подтверждение качества материалов" /><section className="shell certificates-page"><div><ShieldCheck /><p className="eyebrow">Документы мастерской</p><h2>Мы готовим документы к публикации</h2><p>Изделия из джута не входят в перечень продукции, подлежащей обязательной сертификации. Добровольные документы сейчас находятся в процессе оформления и появятся здесь после получения.</p><Button render={<Link href="/contacts" />}>Задать вопрос о материалах</Button></div><Image src="/images/process.png" alt="Натуральный джут и ручная работа" width={620} height={460} /></section></Page>;
}

function LegalBlocks({ blocks }: { blocks: LegalBlock[] }) {
  return (
    <>
      {blocks.map((block, index) => {
        if (block.type === "p") return <p key={index}>{block.text}</p>;
        if (block.type === "list") return <ul key={index}>{block.items.map(item => <li key={item}>{item}</li>)}</ul>;
        return <dl key={index}>{block.rows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>;
      })}
    </>
  );
}

export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const document = type === "privacy" ? privacyPolicy : userAgreement;
  return (
    <Page>
      <section className="shell legal-page">
        <p>{document.updated}</p>
        <h1>{document.title}</h1>
        <div>
          {document.sections.map(section => (
            <article key={section.title}>
              <h2>{section.title}</h2>
              <LegalBlocks blocks={section.blocks} />
            </article>
          ))}
        </div>
      </section>
    </Page>
  );
}
