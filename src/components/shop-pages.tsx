"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight, ExternalLink, Heart, Minus, PackageCheck, Plus, ShoppingBag, Trash2, UserRound } from "lucide-react";
import { Header, Footer } from "@/components/site";
import { useShop, type Order } from "@/components/shop-provider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { paymentUnits } from "@/lib/payments";

const price = (value: number) => `${value.toLocaleString("ru-RU")} ₽`;

function ShopPage({ children }: { children: React.ReactNode }) {
  return <><Header /><main>{children}</main><Footer /></>;
}

function EmptyState({ icon, title, text, action }: { icon: React.ReactNode; title: string; text: string; action: string }) {
  return <div className="shop-empty">{icon}<h2>{title}</h2><p>{text}</p><Button render={<Link href="/catalog" />}>{action} <ArrowRight /></Button></div>;
}

export function CartPage() {
  const { cart, cartTotal, updateQuantity, removeFromCart } = useShop();
  return <ShopPage><section className="shell shop-heading"><p>Главная / Корзина</p><h1>Корзина</h1><span>{cart.length ? `${cart.length} позиции в заказе` : "Пока здесь пусто"}</span></section>
    <section className="shell cart-layout">
      {cart.length === 0 ? <EmptyState icon={<ShoppingBag />} title="Корзина пока пуста" text="Добавьте изделия, которые помогут создать уют в вашем доме." action="Перейти в каталог" /> : <>
        <div className="cart-list">{cart.map(item => <article key={item.id}><Image src={item.image} alt={item.name} width={150} height={150} /><div className="cart-item-copy"><small>Ручная работа</small><h3>{item.name}</h3><p>Натуральный джут</p><button onClick={() => removeFromCart(item.id)}><Trash2 />Удалить</button></div><div className="counter"><button onClick={() => updateQuantity(item.id, item.quantity - 1)}><Minus /></button><span>{item.quantity}</span><button onClick={() => updateQuantity(item.id, item.quantity + 1)}><Plus /></button></div><strong>{price(item.price * item.quantity)}</strong></article>)}</div>
        <aside className="cart-summary"><h3>Ваш заказ</h3><div><span>Товары</span><b>{price(cartTotal)}</b></div><div><span>Доставка</span><b>Рассчитаем далее</b></div><label>Промокод<div><Input placeholder="Введите код" /><Button variant="outline">Применить</Button></div></label><div className="cart-total"><span>Итого</span><strong>{price(cartTotal)}</strong></div><Button render={<Link href="/checkout" />}>Оформить заказ <ArrowRight /></Button><p><PackageCheck />Корзина сохранится на этом устройстве</p></aside>
      </>}
    </section>
  </ShopPage>;
}

function PayPositions({ items }: { items: Order["items"] }) {
  return (
    <div className="pay-positions">
      {paymentUnits(items).map(unit => (
        <article key={unit.key}>
          <Image src={unit.image} alt={unit.name} width={92} height={92} />
          <div>
            <small>Ozon эквайринг{unit.unitCount > 1 ? ` · ${unit.unitIndex} из ${unit.unitCount}` : ""}</small>
            <h3>{unit.name}</h3>
            <strong>{price(unit.price)}</strong>
          </div>
          {unit.payUrl ? (
            <Button render={<a href={unit.payUrl} target="_blank" rel="noopener noreferrer" />}>Оплатить <ExternalLink /></Button>
          ) : (
            <Button disabled>Ожидает ссылку Ozon</Button>
          )}
        </article>
      ))}
    </div>
  );
}

export function CheckoutPage() {
  const { cart, cartTotal, createOrder } = useShop();
  const [delivery, setDelivery] = useState("СДЭК");
  const [pickup, setPickup] = useState("СДЭК · ул. Гончарова, 23");
  const [order, setOrder] = useState<Order | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!cart.length) return;
    setSubmitting(true);
    const data = new FormData(event.currentTarget);
    const customer = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      comment: String(data.get("comment") || ""),
      delivery,
      pickupPoint: pickup,
    };
    const created = createOrder(customer);
    await fetch("/api/requests", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ type: "order", order: created }) }).catch(() => null);
    setOrder(created);
    setSubmitting(false);
  }

  if (order) {
    return (
      <ShopPage>
        <section className="shell shop-heading">
          <p>Оформление / Оплата</p>
          <h1>Оплатите заказ</h1>
          <span>Номер заказа: {order.id}</span>
        </section>
        <section className="shell order-pay">
          <div>
            <p className="eyebrow">Ozon эквайринг</p>
            <h2>Оплата по каждой позиции</h2>
            <p>Под каждым изделием — ссылка на защищённую форму Ozon. Если в позиции несколько штук, оплатите каждую отдельно.</p>
            <PayPositions items={order.items} />
          </div>
          <aside>
            <h3>Итого</h3>
            <strong>{price(order.total)}</strong>
            <p>{order.customer.delivery}: {order.customer.pickupPoint}</p>
            <p>Ссылки сохранятся в личном кабинете, если закроете страницу.</p>
            <div>
              <Button render={<Link href="/account" />}>Личный кабинет</Button>
              <Button variant="outline" render={<Link href="/catalog" />}>Продолжить покупки</Button>
            </div>
          </aside>
        </section>
      </ShopPage>
    );
  }

  if (!cart.length) return <ShopPage><section className="shell cart-layout"><EmptyState icon={<ShoppingBag />} title="Нечего оформлять" text="Сначала добавьте хотя бы одно изделие в корзину." action="Перейти в каталог" /></section></ShopPage>;

  return <ShopPage><section className="shell shop-heading"><p>Корзина / Оформление</p><h1>Оформление заказа</h1><span>Остался один шаг</span></section>
    <form className="shell checkout-layout" onSubmit={submit}><div className="checkout-form">
      <section><b>01</b><div><h2>Получатель</h2><div className="checkout-fields"><label>Имя<Input name="name" required placeholder="Мария" /></label><label>Телефон<Input name="phone" required type="tel" placeholder="+7 (___) ___-__-__" /></label><label>E-mail<Input name="email" required type="email" placeholder="mail@example.ru" /></label></div></div></section>
      <section><b>02</b><div><h2>Способ доставки</h2><div className="delivery-options">{["СДЭК", "Ozon"].map(value => <button type="button" onClick={() => { setDelivery(value); setPickup(value === "СДЭК" ? "СДЭК · ул. Гончарова, 23" : "Ozon · ул. Радищева, 71"); }} className={delivery === value ? "selected" : ""} key={value}><i>{delivery === value && "✓"}</i><span><b>{value}</b><small>Доставка до пункта выдачи</small></span></button>)}</div><label className="pickup-field">Пункт выдачи<select value={pickup} onChange={event => setPickup(event.target.value)}>{delivery === "СДЭК" ? <><option>СДЭК · ул. Гончарова, 23</option><option>СДЭК · пр-т Нариманова, 64</option></> : <><option>Ozon · ул. Радищева, 71</option><option>Ozon · ул. Федерации, 11</option></>}</select></label></div></section>
      <section><b>03</b><div><h2>Комментарий</h2><textarea name="comment" placeholder="Пожелания к заказу или доставке" /></div></section>
    </div><aside className="cart-summary checkout-summary"><h3>Итого</h3>{cart.map(item => <div key={item.id}><span>{item.name} × {item.quantity}</span><b>{price(item.price * item.quantity)}</b></div>)}<div className="cart-total"><span>К оплате</span><strong>{price(cartTotal)}</strong></div><Button type="submit" disabled={submitting}>{submitting ? "Оформляем..." : "Оплатить заказ"} <ArrowRight /></Button><p>После кнопки откроются ссылки оплаты Ozon под каждой позицией</p></aside></form>
  </ShopPage>;
}

export function FavoritesPage() {
  const { favorites, toggleFavorite, addToCart } = useShop();
  return <ShopPage><section className="shell shop-heading"><p>Главная / Избранное</p><h1>Избранное</h1><span>{favorites.length ? `${favorites.length} сохранённых изделий` : "Список пока пуст"}</span></section>
    <section className="shell favorites-page">{favorites.length === 0 ? <EmptyState icon={<Heart />} title="Сохраните то, что нравится" text="Нажмите на сердце в карточке товара — изделие останется здесь после перезагрузки." action="Смотреть каталог" /> : <div className="favorites-grid">{favorites.map(item => <article key={item.id}><div><Image src={item.image} alt={item.name} fill /><button onClick={() => toggleFavorite(item)}><Heart /></button></div><h3>{item.name}</h3><strong>{price(item.price)}</strong><Button onClick={() => addToCart(item)}>В корзину <ShoppingBag /></Button></article>)}</div>}</section>
  </ShopPage>;
}

export function AccountPage() {
  const { orders, favorites } = useShop();
  return <ShopPage><section className="shell shop-heading"><p>Главная / Личный кабинет</p><h1>Личный кабинет</h1><span>Ваши заказы и сохранённые изделия</span></section>
    <section className="shell account-layout"><aside><UserRound /><h3>Гость</h3><p>История сохраняется на этом устройстве</p><Link href="/favorites"><Heart />Избранное <b>{favorites.length}</b></Link><Link href="/cart"><ShoppingBag />Корзина</Link></aside><div className="order-history"><h2>История заказов</h2>{orders.length === 0 ? <div className="history-empty"><PackageCheck /><h3>Заказов пока нет</h3><p>После оформления они появятся здесь.</p><Button render={<Link href="/catalog" />}>Перейти в каталог</Button></div> : orders.map(order => <article key={order.id}><div><span><b>{order.id}</b><small>{new Date(order.createdAt).toLocaleDateString("ru-RU")}</small></span><i>{order.status}</i><strong>{price(order.total)}</strong></div><p>{order.items.map(item => `${item.name} × ${item.quantity}`).join(", ")}</p><small>{order.customer.delivery}: {order.customer.pickupPoint}</small><PayPositions items={order.items} /></article>)}</div></section>
  </ShopPage>;
}
