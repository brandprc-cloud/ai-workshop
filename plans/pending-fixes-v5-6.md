# Ожидающие правки — Landing v5.6
Зафиксировано: 2026-06-11 (со скринов Андрея)
Статус: НЕ применено. Применить в следующей сессии.

---

## ✅ Уже применено в этой сессии
- Шрифт Unbounded weight 300 на все заголовки h2/h3
- card-3d + shimmer эффект на: проекты, программа, аудитория, результаты, оффер чеклист
- Счётчики 47→41 везде (герой + спикер + отзывы)
- Screen 6 tagline: "Это не лекции. Два дня — твой мозг, твои задачи, твой AI-агент."
- Оффер чеклист: убраны дубли, добавлена гарантия + VPS пункт, icon-chip иконки
- Counter animation (0 → max) при входе в вьюпорт: 41, 10, 2 (герой), 41, 96% (спикер)
- Prev-версия сохранена: http://167.233.45.70:8080/prev/

---

## ⏳ Правки из скринов — ПРИМЕНИТЬ В СЛЕДУЮЩЕЙ СЕССИИ

### Fix 1 — Скрин 1: Блок спикера — переставить цифры местами
**Что на скрине:** три карточки статов — 41 (участников воркшопа) | 6500+ (пользователей brochurefinderbot.com) | 96% (получили результат)
**Красные стрелки:** указывают на 6500+ и 96% — нужно их поменять местами
**Итоговый порядок:** 41 | 96% | 6500+
**Также:** "brochurefinderbot.com" в карточке — на мобильном (и десктоп если криво) выровнять подпись под цифрой

**Файл:** `landing/index.html`, секция `data-section="speaker"`, блок `grid grid-cols-3 gap-3`
**Действие:** поменять местами второй и третий `card-float-dark` div

---

### Fix 2 — Скрин 2: Before/After таблица на мобильном — текст крупнее
**Что на скрине:** мобильный вид price-compare, текст в ячейках мелкий
**Действие:** в `.price-row` и `.price-col-header` добавить responsive размер шрифта
```css
/* в custom.css */
@media (max-width: 640px) {
  .price-row { font-size: 15px; padding: 16px 18px; }
  .price-col-header { font-size: 12px; }
}
```

---

### Fix 3 — Скрин 3: Видео-отзывы на мобильном — горизонтальный карусель
**Что на скрине:** на мобильном видны все 4 карточки в 2 столбца
**Нужно:** на мобильном — горизонтальный swipe-карусель, виден 1 отзыв + краешек следующего
**Реализация:**
- На мобильном `.video-grid` → `display: flex; overflow-x: auto; scroll-snap-type: x mandatory; gap: 12px; padding-right: 15%; scroll-padding-left: 16px;`
- Каждая `.video-thumb` → `flex-shrink: 0; width: 85vw; scroll-snap-align: start;`
- Скрыть скроллбар: `::-webkit-scrollbar { display: none; }`
- Десктоп (md:) остаётся grid 3 колонки как есть
```css
@media (max-width: 640px) {
  .video-grid {
    display: flex;
    overflow-x: auto;
    scroll-snap-type: x mandatory;
    gap: 12px;
    padding: 0 16px 8px;
    margin: 0 -16px;
    -webkit-overflow-scrolling: touch;
  }
  .video-grid::-webkit-scrollbar { display: none; }
  .video-grid .video-thumb {
    flex-shrink: 0;
    width: 75vw;
    scroll-snap-align: start;
    border-radius: 16px;
  }
}
```

---

### Fix 4 — Скрин 4: Большие цитаты отзывов — меньше на треть + тоньше
**Что на скрине:** `.testimonial-quote` текст — огромный, визуально давит
**Текущий размер:** `font-size: 20px` (моб) / `22px` (768px+), `font-weight: 500`
**Новый размер:** на треть меньше ≈ `14px`/`16px`, вес `font-weight: 400`
```css
/* в custom.css заменить .testimonial-quote */
.testimonial-quote {
  font-family: var(--f-display);
  font-weight: 400;
  font-size: 14px;
  line-height: 1.55;
  color: var(--t-white);
}
@media (min-width: 768px) { .testimonial-quote { font-size: 16px; } }
```
Примечание: если 14/16 всё равно крупно — попробовать 13/15px.

---

### Fix 5 — Скрин 5: Карточка 96% внизу отзывов — другой шрифт, тоньше
**Что на скрине:** блок `.card-float-dark.rounded-2xl.text-center` с `metric-number` 96% и текстом ниже
**Нужно:** текст "участников уходят со второго дня..." — заменить шрифт на body (Wix Madefor Display), сделать тоньше и светлее
**Действие:** в HTML на этом блоке:
- `<div class="metric-number mb-2">96%</div>` → добавить `data-count="96" class="metric-number counter mb-2"` (счётчик)
- `<p class="text-text-secondary-dark font-sans text-base...">` → уже использует `font-sans`, проверить что не переопределён display-шрифтом
- Если внутри используется `testimonial-quote` класс — убрать его, заменить на `font-sans font-light text-base`

**Файл:** `landing/index.html`, секция `data-section="testimonials"`, в конце `.max-w-3xl` блока
```html
<!-- Итог — заменить на: -->
<div class="card-float-dark card-3d rounded-2xl p-6 text-center">
  <div class="metric-number counter mb-2" data-count="96">96%</div>
  <p class="font-sans font-light text-[#9BA1AB] text-base leading-relaxed">
    участников уходят со второго дня с готовым решением под свою задачу.<br />
    <span class="text-white font-medium">41 выпускник. Первые — топовые риелторы и владельцы агентств Дубая.</span>
  </p>
</div>
```

---

## Проверки перед применением
1. Запустить тесты: `node --test tests/landing.test.mjs` → 41/41 ✅
2. Проверить на мобильном: http://167.233.45.70:8080/
3. Проверить на десктоп: карусель видео не сломана
4. Prev-версия: http://167.233.45.70:8080/prev/ (для сравнения)
