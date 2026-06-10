/**
 * Playwright-тесты для лендинга AI Workshop (TDD / RED-фаза)
 *
 * Тесты написаны ДО вёрстки — все упадут до появления index.html.
 * Тесты опираются на data-section и data-testid атрибуты, а НЕ на Tailwind-классы.
 *
 * Соглашения по атрибутам, которые должна содержать вёрстка:
 *   data-section="hero|pain|audience|projects|program|speaker|testimonials|offer|apply"
 *   data-testid="nav|nav-link-*|cta-primary|metric-participants|metric-group|metric-days"
 *   data-testid="form-apply|form-submit|success-block|bot-link"
 *   data-testid="lang-switch|burger-menu"
 */

import { test, expect, Page } from '@playwright/test';
import path from 'path';

// ─── Хелперы ──────────────────────────────────────────────────────────────────

const RU_PAGE  = `file://${path.resolve(__dirname, '../index.html')}`;
const EN_PAGE  = `file://${path.resolve(__dirname, '../en/index.html')}`;

/** Открыть RU-версию лендинга */
async function openRu(page: Page) {
  await page.goto(RU_PAGE);
  await page.waitForLoadState('domcontentloaded');
}

/** Открыть EN-версию лендинга */
async function openEn(page: Page) {
  await page.goto(EN_PAGE);
  await page.waitForLoadState('domcontentloaded');
}

// ─── 1. Структура страницы ────────────────────────────────────────────────────

test.describe('1. Структура страницы', () => {

  test('1.1 RU-страница открывается без ошибок', async ({ page }) => {
    const response = await page.goto(RU_PAGE);
    // При file:// protocol статус всегда 0 в Playwright; проверяем отсутствие краша
    await expect(page).toHaveTitle(/.+/);
  });

  const ALL_SECTIONS = [
    'hero',
    'pain',
    'audience',
    'projects',
    'program',
    'speaker',
    'testimonials',
    'offer',
    'apply',
  ] as const;

  for (const section of ALL_SECTIONS) {
    test(`1.2 Секция "${section}" присутствует на странице`, async ({ page }) => {
      await openRu(page);
      await expect(page.locator(`[data-section="${section}"]`)).toBeVisible();
    });
  }

  test('1.3 Навигация присутствует на странице', async ({ page }) => {
    await openRu(page);
    await expect(page.getByTestId('nav')).toBeVisible();
  });

  test('1.4 Навигация содержит ссылки на все 9 секций', async ({ page }) => {
    await openRu(page);
    const nav = page.getByTestId('nav');

    const expectedAnchors = ['#hero', '#pain', '#audience', '#projects', '#program', '#speaker', '#testimonials', '#offer', '#apply'];

    for (const anchor of expectedAnchors) {
      await expect(nav.locator(`a[href="${anchor}"]`)).toHaveCount(1, {
        // допускаем, что ссылка одна
      });
    }
  });

});

// ─── 2. Hero ──────────────────────────────────────────────────────────────────

test.describe('2. Hero', () => {

  test('2.1 Заголовок содержит "2 дня"', async ({ page }) => {
    await openRu(page);
    const hero = page.locator('[data-section="hero"]');
    await expect(hero.locator('h1')).toContainText('2 дня');
  });

  test('2.2 Три буллета присутствуют в блоке Hero', async ({ page }) => {
    await openRu(page);
    const hero = page.locator('[data-section="hero"]');
    // Буллеты — элементы списка (li) внутри секции hero
    const bullets = hero.locator('ul li');
    await expect(bullets).toHaveCount(3);
  });

  test('2.3 CTA-кнопка "Подать заявку" видна', async ({ page }) => {
    await openRu(page);
    const hero = page.locator('[data-section="hero"]');
    const cta = hero.getByTestId('cta-primary');
    await expect(cta).toBeVisible();
    await expect(cta).toContainText('Подать заявку');
  });

  test('2.4 Метрика "47 участников" присутствует', async ({ page }) => {
    await openRu(page);
    const metric = page.getByTestId('metric-participants');
    await expect(metric).toContainText('47');
  });

  test('2.5 Метрика "до 10 человек" присутствует', async ({ page }) => {
    await openRu(page);
    const metric = page.getByTestId('metric-group');
    await expect(metric).toContainText('10');
  });

  test('2.6 Метрика "2 дня" в блоке метрик присутствует', async ({ page }) => {
    await openRu(page);
    const metric = page.getByTestId('metric-days');
    await expect(metric).toContainText('2 дня');
  });

});

// ─── 3. Форма заявки ─────────────────────────────────────────────────────────

test.describe('3. Форма заявки', () => {

  test('3.1 Форма содержит ровно 10 полей (input + select + textarea)', async ({ page }) => {
    await openRu(page);
    const form = page.getByTestId('form-apply');
    const fields = form.locator('input, select, textarea');
    await expect(fields).toHaveCount(10);
  });

  test('3.2 Поле Telegram присутствует', async ({ page }) => {
    await openRu(page);
    const form = page.getByTestId('form-apply');
    // Поле должно иметь name="telegram" или placeholder содержащий "@"
    const telegramField = form.locator('[name="telegram"], input[placeholder*="@"]');
    await expect(telegramField).toHaveCount(1);
  });

  test('3.3 Поле "Задача" является textarea', async ({ page }) => {
    await openRu(page);
    const form = page.getByTestId('form-apply');
    const taskField = form.locator('textarea[name="task"], textarea[name="задача"], textarea');
    await expect(taskField).toHaveCount(1);
  });

  test('3.4 Кнопка отправки формы присутствует и содержит "Отправить заявку"', async ({ page }) => {
    await openRu(page);
    const submitBtn = page.getByTestId('form-submit');
    await expect(submitBtn).toBeVisible();
    await expect(submitBtn).toContainText('Отправить заявку');
  });

  test('3.5 После submit показывается success-блок', async ({ page }) => {
    await openRu(page);

    // Заполняем обязательные поля формы
    const form = page.getByTestId('form-apply');

    // Имя
    const nameInput = form.locator('[name="name"], input[placeholder*="обращаться"]');
    if (await nameInput.count() > 0) await nameInput.first().fill('Тест Тестов');

    // Telegram
    const tgInput = form.locator('[name="telegram"], input[placeholder*="@username"]');
    if (await tgInput.count() > 0) await tgInput.first().fill('@test_user');

    // Телефон/email
    const contactInput = form.locator('[name="contact"], [name="email"], [name="phone"]');
    if (await contactInput.count() > 0) await contactInput.first().fill('test@example.com');

    // Город
    const cityInput = form.locator('[name="city"], input[placeholder*="Дубай"]');
    if (await cityInput.count() > 0) await cityInput.first().fill('Дубай');

    // Textarea задача
    const taskArea = form.locator('textarea').first();
    if (await taskArea.count() > 0) await taskArea.fill('Хочу автоматизировать квалификацию лидов');

    // Нажимаем submit
    const submitBtn = page.getByTestId('form-submit');
    await submitBtn.click();

    // Success-блок должен появиться
    const successBlock = page.getByTestId('success-block');
    await expect(successBlock).toBeVisible({ timeout: 3000 });
  });

  test('3.6 Success-экран содержит текст "Заявка принята"', async ({ page }) => {
    await openRu(page);

    // Программно показываем success-блок (он может быть скрыт через display:none)
    await page.evaluate(() => {
      const el = document.querySelector('[data-testid="success-block"]') as HTMLElement | null;
      if (el) el.style.display = 'block';
      // Также скрываем форму
      const form = document.querySelector('[data-testid="form-apply"]') as HTMLElement | null;
      if (form) form.style.display = 'none';
    });

    const successBlock = page.getByTestId('success-block');
    await expect(successBlock).toContainText('Заявка принята');
  });

  test('3.7 Success-экран содержит ссылку на @ArtashesAIBot', async ({ page }) => {
    await openRu(page);

    // Показываем success-блок напрямую
    await page.evaluate(() => {
      const el = document.querySelector('[data-testid="success-block"]') as HTMLElement | null;
      if (el) el.style.display = 'block';
    });

    const botLink = page.getByTestId('bot-link');
    await expect(botLink).toBeVisible();
    // Ссылка ведёт на t.me/ArtashesAIBot
    await expect(botLink).toHaveAttribute('href', /ArtashesAIBot/i);
  });

});

// ─── 4. Переключатель языков ──────────────────────────────────────────────────

test.describe('4. Переключатель языков', () => {

  test('4.1 На RU-странице есть ссылка на /en/ версию', async ({ page }) => {
    await openRu(page);
    const langSwitch = page.getByTestId('lang-switch');
    await expect(langSwitch).toBeVisible();
    // Ссылка ведёт на EN-версию
    await expect(langSwitch).toHaveAttribute('href', /\/en\//);
  });

  test('4.2 Файл EN-версии существует и открывается', async ({ page }) => {
    await openEn(page);
    // Если файл не существует — заголовок будет пустым или Playwright выбросит ошибку
    await expect(page).toHaveTitle(/.+/);
  });

  test('4.3 EN-страница содержит переключатель на RU', async ({ page }) => {
    await openEn(page);
    const langSwitch = page.getByTestId('lang-switch');
    await expect(langSwitch).toBeVisible();
    // Ссылка ведёт обратно на корень или RU-версию
    await expect(langSwitch).toHaveAttribute('href', /^\/$|\/ru\/|index\.html/);
  });

});

// ─── 5. Адаптивность ─────────────────────────────────────────────────────────

test.describe('5. Адаптивность', () => {

  test('5.1 На viewport 1440px все 9 секций видны', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await openRu(page);

    const sections = ['hero', 'pain', 'audience', 'projects', 'program', 'speaker', 'testimonials', 'offer', 'apply'];
    for (const section of sections) {
      // Скроллим к секции и проверяем что она существует в DOM
      const el = page.locator(`[data-section="${section}"]`);
      await expect(el).toBeAttached();
    }
  });

  test('5.2 На viewport 375px (mobile) страница рендерится без горизонтального скролла', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openRu(page);

    // Ширина body не должна превышать viewport
    const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
    expect(bodyWidth).toBeLessThanOrEqual(375);
  });

  test('5.3 На мобиле навигация доступна (бургер-меню или сжатая навигация)', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openRu(page);

    // Либо бургер-меню видно, либо сама навигация видна (адаптированная)
    const burgerVisible   = await page.getByTestId('burger-menu').isVisible().catch(() => false);
    const navVisible      = await page.getByTestId('nav').isVisible().catch(() => false);

    expect(burgerVisible || navVisible).toBe(true);
  });

  test('5.4 CTA-кнопка "Подать заявку" видна на мобиле', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await openRu(page);

    const cta = page.getByTestId('cta-primary');
    await expect(cta).toBeVisible();
  });

});

// ─── 6. Ссылки ────────────────────────────────────────────────────────────────

test.describe('6. Ссылки', () => {

  test('6.1 Все якорные ссылки навигации ведут к существующим элементам', async ({ page }) => {
    await openRu(page);

    const anchors = ['hero', 'pain', 'audience', 'projects', 'program', 'speaker', 'testimonials', 'offer', 'apply'];

    for (const anchor of anchors) {
      const target = page.locator(`[data-section="${anchor}"], #${anchor}`);
      await expect(target).toHaveCount(1, { timeout: 2000 });
    }
  });

  test('6.2 Ссылка на WhatsApp содержит корректный международный номер (+971)', async ({ page }) => {
    await openRu(page);

    // WhatsApp-ссылка: wa.me/971... или https://wa.me/...
    const waLink = page.locator('a[href*="wa.me"], a[href*="whatsapp"]').first();
    await expect(waLink).toHaveCount(1);
    const href = await waLink.getAttribute('href');
    expect(href).toMatch(/971/); // UAE код
  });

  test('6.3 Ссылка на @ArtashesAIBot присутствует на странице', async ({ page }) => {
    await openRu(page);

    const botLink = page.locator('a[href*="ArtashesAIBot"], a[href*="t.me/ArtashesAIBot"]').first();
    await expect(botLink).toHaveCount(1);
  });

  test('6.4 Якорная ссылка CTA-кнопки в Hero ведёт к секции #apply', async ({ page }) => {
    await openRu(page);

    const heroCta = page.locator('[data-section="hero"]').getByTestId('cta-primary');
    await expect(heroCta).toHaveAttribute('href', '#apply');
  });

});

// ─── 7. Базовые SEO и производительность ─────────────────────────────────────

test.describe('7. SEO и базовые мета-теги', () => {

  test('7.1 Тег <title> не пустой', async ({ page }) => {
    await openRu(page);
    await expect(page).toHaveTitle(/.{5,}/); // минимум 5 символов
  });

  test('7.2 Meta description присутствует и не пустой', async ({ page }) => {
    await openRu(page);

    const metaDescription = page.locator('meta[name="description"]');
    await expect(metaDescription).toHaveCount(1);

    const content = await metaDescription.getAttribute('content');
    expect(content).toBeTruthy();
    expect((content ?? '').length).toBeGreaterThan(20);
  });

  test('7.3 Meta viewport присутствует (обязательно для адаптивности)', async ({ page }) => {
    await openRu(page);

    const metaViewport = page.locator('meta[name="viewport"]');
    await expect(metaViewport).toHaveCount(1);

    const content = await metaViewport.getAttribute('content');
    expect(content).toContain('width=device-width');
  });

  test('7.4 Open Graph: og:title присутствует', async ({ page }) => {
    await openRu(page);
    const ogTitle = page.locator('meta[property="og:title"]');
    await expect(ogTitle).toHaveCount(1);
    const content = await ogTitle.getAttribute('content');
    expect(content).toBeTruthy();
  });

  test('7.5 Все теги <img> имеют непустой alt-атрибут', async ({ page }) => {
    await openRu(page);

    const images = page.locator('img');
    const count = await images.count();

    if (count === 0) {
      // Нет изображений — тест проходит
      return;
    }

    for (let i = 0; i < count; i++) {
      const alt = await images.nth(i).getAttribute('alt');
      expect(alt, `img[${i}] не имеет alt-атрибута`).toBeTruthy();
    }
  });

  test('7.6 Атрибут lang на <html> установлен (ru для RU-версии)', async ({ page }) => {
    await openRu(page);

    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toMatch(/^ru/i);
  });

  test('7.7 Favicon подключён', async ({ page }) => {
    await openRu(page);

    const favicon = page.locator('link[rel*="icon"]');
    await expect(favicon).toHaveCount(1);
  });

});

// ─── 8. Контентные проверки (ключевые строки) ────────────────────────────────

test.describe('8. Контент — ключевые тексты', () => {

  test('8.1 Блок "Боль": присутствуют 4 пункта боли', async ({ page }) => {
    await openRu(page);
    const painSection = page.locator('[data-section="pain"]');
    // Боли оформлены как список li
    const pains = painSection.locator('ul li');
    await expect(pains).toHaveCount(4);
  });

  test('8.2 Блок "Кому подходит": 6 характеристик', async ({ page }) => {
    await openRu(page);
    const audienceSection = page.locator('[data-section="audience"]');
    // Характеристики идеального участника — список из 6 li
    const fits = audienceSection.locator('[data-testid="fits-list"] li');
    await expect(fits).toHaveCount(6);
  });

  test('8.3 Блок "Кому НЕ подходит": 3 фильтра', async ({ page }) => {
    await openRu(page);
    const audienceSection = page.locator('[data-section="audience"]');
    const notFits = audienceSection.locator('[data-testid="not-fits-list"] li');
    await expect(notFits).toHaveCount(3);
  });

  test('8.4 Блок "Проекты": 8 карточек A–H', async ({ page }) => {
    await openRu(page);
    const projectsSection = page.locator('[data-section="projects"]');
    const cards = projectsSection.locator('[data-testid="project-card"]');
    await expect(cards).toHaveCount(8);
  });

  test('8.5 Блок "Программа": содержит День 1 и День 2', async ({ page }) => {
    await openRu(page);
    const programSection = page.locator('[data-section="program"]');
    await expect(programSection).toContainText('День 1');
    await expect(programSection).toContainText('День 2');
  });

  test('8.6 Блок "Спикер": имя "Арташес Григорян" присутствует', async ({ page }) => {
    await openRu(page);
    const speakerSection = page.locator('[data-section="speaker"]');
    await expect(speakerSection).toContainText('Арташес Григорян');
  });

  test('8.7 Блок "Спикер": "47 участников" упомянуто', async ({ page }) => {
    await openRu(page);
    const speakerSection = page.locator('[data-section="speaker"]');
    await expect(speakerSection).toContainText('47');
  });

  test('8.8 Блок "Отзывы": 4 цитаты присутствуют', async ({ page }) => {
    await openRu(page);
    const testimonials = page.locator('[data-section="testimonials"]');
    const quotes = testimonials.locator('[data-testid="testimonial-item"]');
    await expect(quotes).toHaveCount(4);
  });

  test('8.9 Блок "Отзывы": текст "96%" присутствует', async ({ page }) => {
    await openRu(page);
    const testimonials = page.locator('[data-section="testimonials"]');
    await expect(testimonials).toContainText('96%');
  });

  test('8.10 Блок "Оффер": цена "2000 AED" присутствует', async ({ page }) => {
    await openRu(page);
    const offerSection = page.locator('[data-section="offer"]');
    await expect(offerSection).toContainText('2000 AED');
  });

  test('8.11 Блок "Оффер": CTA-кнопка "Подать заявку" присутствует', async ({ page }) => {
    await openRu(page);
    const offerSection = page.locator('[data-section="offer"]');
    const cta = offerSection.locator('a, button').filter({ hasText: 'Подать заявку' });
    await expect(cta).toHaveCount(1);
  });

  test('8.12 Таблица До/После содержит 5 строк сравнения', async ({ page }) => {
    await openRu(page);
    const painSection = page.locator('[data-section="pain"]');
    // tbody tr — строки таблицы (без заголовка thead)
    const rows = painSection.locator('table tbody tr');
    await expect(rows).toHaveCount(5);
  });

});

// ─── 9. EN-версия (базовые проверки) ─────────────────────────────────────────

test.describe('9. EN-версия лендинга', () => {

  test('9.1 EN-страница имеет lang="en" на <html>', async ({ page }) => {
    await openEn(page);
    const lang = await page.locator('html').getAttribute('lang');
    expect(lang).toMatch(/^en/i);
  });

  test('9.2 EN-страница содержит все 9 секций', async ({ page }) => {
    await openEn(page);

    const sections = ['hero', 'pain', 'audience', 'projects', 'program', 'speaker', 'testimonials', 'offer', 'apply'];
    for (const section of sections) {
      await expect(page.locator(`[data-section="${section}"]`)).toBeAttached();
    }
  });

  test('9.3 EN-страница: CTA-кнопка содержит "Apply" (английский вариант)', async ({ page }) => {
    await openEn(page);
    const heroCta = page.locator('[data-section="hero"]').getByTestId('cta-primary');
    await expect(heroCta).toContainText(/apply/i);
  });

  test('9.4 EN-страница: форма содержит 10 полей', async ({ page }) => {
    await openEn(page);
    const form = page.getByTestId('form-apply');
    const fields = form.locator('input, select, textarea');
    await expect(fields).toHaveCount(10);
  });

});
