# Ожидающие правки — Landing v5.7
Зафиксировано: 2026-06-11 (со скринов Андрея)
Статус: ПРИМЕНЕНО 2026-06-11. Все 41 тест прошли.

---

## Fix 1 — Hero: лейбл «УЧАСТНИКОВ» → «ПРОШЛИ ВОРКШОП»

**Где:** `landing/index.html`, секция `data-section="hero"`, блок `grid grid-cols-3 gap-6 max-w-md`
**Что изменить:** у первой метрики (41) лейбл `УЧАСТНИКОВ` → `ПРОШЛИ ВОРКШОП`

```html
<!-- Найти: -->
<div class="text-[#9BA1AB] text-sm mt-1 uppercase tracking-wider">участников</div>

<!-- Заменить на: -->
<div class="text-[#9BA1AB] text-sm mt-1 uppercase tracking-wider">прошли воркшоп</div>
```

---

## Fix 2 — Hero: метрики (41 / 10 / 2) — оформить как карточки спикера

**Где:** тот же блок `grid grid-cols-3 gap-6 max-w-md mb-10` в hero
**Что:** сейчас цифры голые — просто число + подпись. Нужно обернуть каждую в `card-float-dark card-3d rounded-xl p-4 text-center`, как сделано у спикера (секция `data-section="speaker"`).

```html
<!-- Найти блок (примерно): -->
<div class="grid grid-cols-3 gap-6 max-w-md mb-10">
  <div data-testid="metric-participants">
    <div class="metric-number counter text-3xl sm:text-4xl" data-count="41">41</div>
    <div class="text-[#9BA1AB] text-sm mt-1 uppercase tracking-wider">участников</div>
  </div>
  <div data-testid="metric-group">
    <div class="metric-number counter text-3xl sm:text-4xl" data-count="10">10</div>
    <div class="text-[#9BA1AB] text-sm mt-1 uppercase tracking-wider">человек в группе</div>
  </div>
  <div data-testid="metric-days">
    <div class="metric-number counter text-3xl sm:text-4xl" data-count="2">2</div>
    <div class="text-[#9BA1AB] text-sm mt-1 uppercase tracking-wider">дня в Дубае</div>
  </div>
</div>

<!-- Заменить на: -->
<div class="grid grid-cols-3 gap-3 max-w-md mb-10">
  <div class="card-float-dark card-3d rounded-xl p-4 text-center" data-testid="metric-participants">
    <div class="metric-number counter text-3xl sm:text-4xl" data-count="41">41</div>
    <div class="text-[#9BA1AB] font-sans text-xs mt-1">прошли воркшоп</div>
  </div>
  <div class="card-float-dark card-3d rounded-xl p-4 text-center" data-testid="metric-group">
    <div class="metric-number counter text-3xl sm:text-4xl" data-count="10">10</div>
    <div class="text-[#9BA1AB] font-sans text-xs mt-1">человек в группе</div>
  </div>
  <div class="card-float-dark card-3d rounded-xl p-4 text-center" data-testid="metric-days">
    <div class="metric-number counter text-3xl sm:text-4xl" data-count="2">2</div>
    <div class="text-[#9BA1AB] font-sans text-xs mt-1">дня в Дубае</div>
  </div>
</div>
```

Карточки получат автоматически: shimmer при hover, 3D-наклон, border с оранжевым glow — как у спикера.

---

## Fix 3 — Кнопка «Записаться» в iso-viz: мигание при hover

**Где:** `landing/index.html`, секция с ISO-визуализацией (hidden lg:block), кнопка рядом с RESULT
**Что:** добавить pulse/shimmer анимацию при hover

**В custom.css добавить:**
```css
/* Кнопка «Записаться» в iso-viz: pulse при hover */
.iso-cta-pulse:hover {
  animation: iso-cta-blink 0.7s ease-in-out infinite alternate;
}
@keyframes iso-cta-blink {
  0%   { filter: brightness(1); box-shadow: 0 4px 0 #8B3500, 0 6px 20px rgba(232,114,42,0.40); }
  100% { filter: brightness(1.25); box-shadow: 0 4px 0 #8B3500, 0 8px 32px rgba(232,114,42,0.75), 0 0 0 4px rgba(255,160,80,0.35); }
}
```

**В HTML добавить класс `iso-cta-pulse` к кнопке:**
```html
<!-- Найти: -->
<a href="#apply" class="btn-primary rounded-xl flex items-center justify-center gap-2 text-sm font-bold" style="min-height:56px">

<!-- Заменить на: -->
<a href="#apply" class="btn-primary iso-cta-pulse rounded-xl flex items-center justify-center gap-2 text-sm font-bold" style="min-height:56px">
```

---

## Порядок применения

1. Fix 1 — лейбл (2 минуты)
2. Fix 2 — карточки метрик (5 минут)
3. Fix 3 — CSS + класс кнопки (5 минут)
4. Проверить тесты: `node --test tests/landing.test.mjs`
5. Проверить на мобиле: http://167.233.45.70:8080/
