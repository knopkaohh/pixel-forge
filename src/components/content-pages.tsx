"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ChevronDown, Leaf, PackageCheck, ShieldCheck, Sparkles } from "lucide-react";
import { Header, Footer } from "@/components/site";
import { Button } from "@/components/ui/button";

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
  ["Можно ли изготовить изделие по индивидуальным размерам?", "Да. Воспользуйтесь калькулятором, укажите форму и размеры — мастер свяжется с вами для согласования."],
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
  returns: {
    title: "Возврат и обмен",
    text: "Понятные условия и бережное отношение к каждому заказу",
    icon: <PackageCheck />,
    sections: [
      ["Срок возврата", "Готовое изделие надлежащего качества можно вернуть в течение 14 дней после получения при сохранении товарного вида."],
      ["Как оформить", "Свяжитесь с нами, назовите номер заказа и приложите фотографии изделия и упаковки."],
      ["Индивидуальные изделия", "Товары, изготовленные по персональным размерам, подлежат возврату только при наличии производственного дефекта."],
    ],
  },
  warranty: {
    title: "Гарантия качества",
    text: "Мы отвечаем за материалы и работу наших мастеров",
    icon: <ShieldCheck />,
    sections: [
      ["Проверка перед отправкой", "Каждое изделие проходит ручную проверку формы, плетения и обработки края."],
      ["Гарантийный случай", "Если вы обнаружили производственный недостаток, сообщите нам в течение 30 дней после получения."],
      ["Ручная работа", "Небольшие различия фактуры и оттенка не являются дефектом — они подтверждают натуральность материала."],
    ],
  },
};

export function InformationPage({ type }: { type: keyof typeof infoPages }) {
  const data = infoPages[type];
  return <Page><Hero title={data.title} text={data.text} /><section className="shell editorial-info"><div className="editorial-icon">{data.icon}</div>{data.sections.map(([title, text], i) => <article key={title}><b>0{i + 1}</b><h2>{title}</h2><p>{text}</p></article>)}<div className="editorial-cta"><h3>Остались вопросы?</h3><Button render={<Link href="/contacts" />}>Связаться с нами</Button></div></section></Page>;
}

export function PromotionsPage() {
  return <Page><Hero title="Акции" text="Особые предложения для ещё большего уюта" /><section className="shell promotions-grid"><article><Image src="/images/hero.png" alt="" fill /><div><span>До 30 сентября</span><h2>Бесплатная доставка</h2><p>При заказе от 15 000 ₽ до пункта выдачи.</p><Button render={<Link href="/catalog" />}>Выбрать изделия</Button></div></article><article><Image src="/images/basket.png" alt="" fill /><div><span>Для нового дома</span><h2>Комплект выгоднее</h2><p>Скидка 10% при покупке трёх изделий.</p><Button render={<Link href="/catalog" />}>Смотреть подборку</Button></div></article></section></Page>;
}

export function CertificatesPage() {
  return <Page><Hero title="Сертификаты" text="Документы и подтверждение качества материалов" /><section className="shell certificates-page"><div><ShieldCheck /><p className="eyebrow">Документы мастерской</p><h2>Мы готовим документы к публикации</h2><p>Изделия из джута не входят в перечень продукции, подлежащей обязательной сертификации. Добровольные документы сейчас находятся в процессе оформления и появятся здесь после получения.</p><Button render={<Link href="/contacts" />}>Задать вопрос о материалах</Button></div><Image src="/images/process.png" alt="Натуральный джут и ручная работа" width={620} height={460} /></section></Page>;
}

export function LegalPage({ type }: { type: "privacy" | "terms" }) {
  const privacy = type === "privacy";
  const title = privacy ? "Политика конфиденциальности" : "Пользовательское соглашение";
  return <Page><section className="shell legal-page"><p>Обновлено 19 сентября 2026</p><h1>{title}</h1><div><h2>1. Общие положения</h2><p>Настоящий документ регулирует использование сайта «Мэри Джут». Перед публикацией юридические формулировки и реквизиты должны быть проверены владельцем сайта.</p><h2>2. Данные и обращения</h2><p>{privacy ? "Данные, указанные при оформлении заказа или обращении, используются только для обработки запроса, доставки и связи с покупателем." : "Информация на сайте носит справочный характер. Итоговая стоимость, сроки изготовления и доставки подтверждаются при оформлении заказа."}</p><h2>3. Контакты</h2><p>По вопросам обработки данных и работы сайта обращайтесь по адресу hello@mary-jute.ru.</p></div></section></Page>;
}
