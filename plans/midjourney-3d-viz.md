# Midjourney промпт — 3D ISO визуализация AI процессов

Используй этот промпт в Midjourney или Flux чтобы получить 3D-рендер для секции "Боль" лендинга.

## Промпт

```
isometric 3D floating glass cards connected by glowing orange particle lines, dark charcoal background #0D0F14, 5 cards labeled: ANALYSIS, PROCESS IDENTIFIED, TOOLS, AUTOMATION, RESULT, each card has orange icon badge with white icon, cards have frosted glass material with subtle reflection, orange (#E8722A) neon connecting lines with arrow directions flowing top to bottom, orange particle sparks at connection points, dramatic depth of field, professional tech product visualization, 8k, sharp focus, studio lighting --ar 4:3 --style raw --v 6
```

## Куда вставить

Файл: `landing/index.html`  
Секция: `data-section="pain"` (после блока 4 боли)

Когда получишь изображение — замени CSS `.iso-viz-wrap` блок на:
```html
<div class="mb-4">
  <img src="./assets/img/ai-viz-3d.jpg" alt="" class="w-full max-w-2xl mx-auto rounded-2xl" loading="lazy" />
</div>
```

И положи файл в `landing/assets/img/ai-viz-3d.jpg`
