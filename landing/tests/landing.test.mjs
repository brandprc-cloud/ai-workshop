/**
 * Тесты лендинга AI Workshop — cheerio + jsdom (без браузера)
 * Запуск: node --test tests/landing.test.mjs
 */

import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import * as cheerio from 'cheerio';

const __dir = dirname(fileURLToPath(import.meta.url));
const RU_PATH = resolve(__dir, '../index.html');
const EN_PATH = resolve(__dir, '../en/index.html');

function loadPage(filePath) {
  const html = readFileSync(filePath, 'utf-8');
  return cheerio.load(html);
}

// ─── 1. Структура ──────────────────────────────────────────────────────────────

describe('1. Структура страницы', () => {
  const $ = loadPage(RU_PATH);

  test('Все 9 секций присутствуют', () => {
    const sections = ['hero','pain','audience','projects','program','speaker','testimonials','offer','apply'];
    for (const s of sections) {
      assert.ok($(`[data-section="${s}"]`).length > 0, `Отсутствует секция data-section="${s}"`);
    }
  });

  test('Навигация присутствует', () => {
    assert.ok($('[data-testid="nav"]').length > 0, 'Нет элемента data-testid="nav"');
  });

  test('Бургер-меню присутствует', () => {
    assert.ok($('[data-testid="burger-menu"]').length > 0, 'Нет бургер-меню');
  });
});

// ─── 2. Hero ───────────────────────────────────────────────────────────────────

describe('2. Hero', () => {
  const $ = loadPage(RU_PATH);

  test('Заголовок содержит "2 дня"', () => {
    const heroText = $('[data-section="hero"]').text();
    assert.ok(heroText.includes('2 дня'), 'Заголовок не содержит "2 дня"');
  });

  test('Три буллета присутствуют', () => {
    const hero = $('[data-section="hero"]');
    const bullets = hero.find('li');
    assert.ok(bullets.length >= 3, `Буллетов ${bullets.length}, нужно минимум 3`);
  });

  test('CTA-кнопка "Подать заявку" присутствует', () => {
    assert.ok($('[data-testid="cta-primary"]').length > 0, 'Нет CTA data-testid="cta-primary"');
    const ctaText = $('[data-testid="cta-primary"]').text();
    assert.ok(ctaText.includes('заявку'), `CTA содержит "${ctaText}", нужно "заявку"`);
  });

  test('Метрика 47 участников присутствует', () => {
    assert.ok($('[data-testid="metric-participants"]').length > 0, 'Нет metric-participants');
    assert.ok($('[data-testid="metric-participants"]').text().includes('47'));
  });

  test('Метрика "10" (группа) присутствует', () => {
    assert.ok($('[data-testid="metric-group"]').length > 0, 'Нет metric-group');
    assert.ok($('[data-testid="metric-group"]').text().includes('10'));
  });

  test('Метрика "2 дня" присутствует', () => {
    assert.ok($('[data-testid="metric-days"]').length > 0, 'Нет metric-days');
    assert.ok($('[data-testid="metric-days"]').text().includes('2'));
  });
});

// ─── 3. Форма заявки ───────────────────────────────────────────────────────────

describe('3. Форма заявки', () => {
  const $ = loadPage(RU_PATH);

  test('Форма присутствует', () => {
    assert.ok($('[data-testid="form-apply"]').length > 0, 'Нет data-testid="form-apply"');
  });

  test('Форма содержит 10 полей (input/select/textarea)', () => {
    const form = $('[data-testid="form-apply"]');
    const fields = form.find('input, select, textarea');
    assert.ok(fields.length >= 10, `Полей ${fields.length}, нужно минимум 10`);
  });

  test('Поле Telegram присутствует', () => {
    const form = $('[data-testid="form-apply"]');
    const hasTelegram = form.find('[name="telegram"], [name="Telegram"], [placeholder*="telegram"], [placeholder*="Telegram"], [placeholder*="@username"]').length > 0;
    assert.ok(hasTelegram, 'Поле Telegram не найдено');
  });

  test('Поле "задача" является textarea', () => {
    const form = $('[data-testid="form-apply"]');
    assert.ok(form.find('textarea').length > 0, 'Нет textarea в форме');
  });

  test('Кнопка отправки присутствует', () => {
    assert.ok($('[data-testid="form-submit"]').length > 0, 'Нет data-testid="form-submit"');
    const btnText = $('[data-testid="form-submit"]').text();
    assert.ok(btnText.includes('Отправить') || btnText.includes('заявк'), `Текст кнопки: "${btnText}"`);
  });

  test('Success-блок присутствует в DOM (скрытый)', () => {
    assert.ok($('[data-testid="success-block"]').length > 0, 'Нет data-testid="success-block"');
  });

  test('Success-блок содержит "Заявка принята"', () => {
    const successText = $('[data-testid="success-block"]').text();
    assert.ok(successText.includes('Заявка принята'), `Success текст: "${successText}"`);
  });

  test('Success-блок содержит ссылку @ArtashesAIBot', () => {
    const botLink = $('[data-testid="bot-link"]');
    assert.ok(botLink.length > 0, 'Нет data-testid="bot-link"');
    const href = botLink.attr('href') || '';
    assert.ok(href.includes('ArtashesAIBot') || href.includes('t.me'), `href бота: "${href}"`);
  });
});

// ─── 4. Переключатель языков ────────────────────────────────────────────────────

describe('4. Переключатель языков', () => {
  test('RU-страница содержит ссылку на /en/ версию', () => {
    const $ = loadPage(RU_PATH);
    const langSwitch = $('[data-testid="lang-switch"]');
    assert.ok(langSwitch.length > 0, 'Нет data-testid="lang-switch"');
    const href = langSwitch.attr('href') || langSwitch.find('a').attr('href') || '';
    assert.ok(href.includes('en'), `lang-switch href: "${href}"`);
  });

  test('EN-страница существует и содержит lang="en"', () => {
    const $ = loadPage(EN_PATH);
    const lang = $('html').attr('lang');
    assert.equal(lang, 'en', `lang на <html>: "${lang}"`);
  });

  test('EN-страница содержит все 9 секций', () => {
    const $ = loadPage(EN_PATH);
    const sections = ['hero','pain','audience','projects','program','speaker','testimonials','offer','apply'];
    for (const s of sections) {
      assert.ok($(`[data-section="${s}"]`).length > 0, `EN: отсутствует секция "${s}"`);
    }
  });
});

// ─── 5. Ссылки ──────────────────────────────────────────────────────────────────

describe('5. Ссылки', () => {
  const $ = loadPage(RU_PATH);

  test('Ссылка WhatsApp содержит +971', () => {
    let found = false;
    $('a[href*="wa.me"], a[href*="whatsapp"]').each((_, el) => {
      if ($(el).attr('href')?.includes('971')) found = true;
    });
    assert.ok(found, 'Ссылка WhatsApp с +971 не найдена');
  });

  test('Ссылка на @ArtashesAIBot присутствует', () => {
    let found = false;
    $('a').each((_, el) => {
      const href = $(el).attr('href') || '';
      const text = $(el).text();
      if (href.includes('ArtashesAIBot') || text.includes('ArtashesAIBot')) found = true;
    });
    assert.ok(found, 'Ссылка @ArtashesAIBot не найдена');
  });

  test('CTA ведёт к секции #apply', () => {
    const cta = $('[data-testid="cta-primary"]');
    const href = cta.attr('href') || '';
    assert.ok(href.includes('apply'), `CTA href: "${href}"`);
  });
});

// ─── 6. SEO ─────────────────────────────────────────────────────────────────────

describe('6. SEO и мета-теги', () => {
  const $ = loadPage(RU_PATH);

  test('<title> не пустой', () => {
    const title = $('title').text().trim();
    assert.ok(title.length > 0, 'Тег <title> пустой');
  });

  test('Meta description присутствует', () => {
    const desc = $('meta[name="description"]').attr('content') || '';
    assert.ok(desc.length > 10, `meta description: "${desc}"`);
  });

  test('Meta viewport присутствует', () => {
    assert.ok($('meta[name="viewport"]').length > 0, 'Нет meta viewport');
  });

  test('og:title присутствует', () => {
    assert.ok($('meta[property="og:title"]').length > 0, 'Нет og:title');
  });

  test('lang="ru" на <html>', () => {
    assert.equal($('html').attr('lang'), 'ru', 'lang на <html> не "ru"');
  });

  test('Favicon подключён', () => {
    const favicon = $('link[rel*="icon"]');
    assert.ok(favicon.length > 0, 'Favicon не найден');
  });
});

// ─── 7. Контент ─────────────────────────────────────────────────────────────────

describe('7. Контент', () => {
  const $ = loadPage(RU_PATH);

  test('Блок боли: 4 пункта', () => {
    const pain = $('[data-section="pain"]');
    const items = pain.find('li');
    assert.ok(items.length >= 4, `Пунктов боли: ${items.length}`);
  });

  test('Кому подходит: 6 характеристик', () => {
    const fits = $('[data-testid="fits-list"] li');
    assert.ok(fits.length >= 6, `Характеристик: ${fits.length}`);
  });

  test('Кому НЕ подходит: 3 фильтра', () => {
    const notFits = $('[data-testid="not-fits-list"] li');
    assert.ok(notFits.length >= 3, `Фильтров: ${notFits.length}`);
  });

  test('8 карточек проектов A–H', () => {
    const cards = $('[data-testid="project-card"]');
    assert.ok(cards.length >= 8, `Карточек: ${cards.length}`);
  });

  test('Программа: День 1 и День 2', () => {
    const program = $('[data-section="program"]').text();
    assert.ok(program.includes('День 1') || program.includes('Day 1'), 'Нет "День 1"');
    assert.ok(program.includes('День 2') || program.includes('Day 2'), 'Нет "День 2"');
  });

  test('Спикер: "Арташес Григорян" присутствует', () => {
    assert.ok($('[data-section="speaker"]').text().includes('Арташес Григорян'));
  });

  test('Отзывы: 4 цитаты', () => {
    const items = $('[data-testid="testimonial-item"]');
    assert.ok(items.length >= 4, `Цитат: ${items.length}`);
  });

  test('Отзывы: текст "96%" присутствует', () => {
    assert.ok($('[data-section="testimonials"]').text().includes('96%'));
  });

  test('Оффер: цена "2000 AED"', () => {
    assert.ok($('[data-section="offer"]').text().includes('2000 AED'));
  });

  test('Таблица До/После: 5 строк', () => {
    const rows = $('[data-section="pain"] tbody tr');
    assert.ok(rows.length >= 5, `Строк в таблице: ${rows.length}`);
  });
});

// ─── 8. EN-версия ───────────────────────────────────────────────────────────────

describe('8. EN-версия', () => {
  const $ = loadPage(EN_PATH);

  test('Форма EN содержит 10 полей', () => {
    const form = $('[data-testid="form-apply"]');
    const fields = form.find('input, select, textarea');
    assert.ok(fields.length >= 10, `EN полей: ${fields.length}`);
  });

  test('CTA содержит "Apply"', () => {
    const cta = $('[data-testid="cta-primary"]').text();
    assert.ok(cta.toLowerCase().includes('apply'), `EN CTA: "${cta}"`);
  });
});
