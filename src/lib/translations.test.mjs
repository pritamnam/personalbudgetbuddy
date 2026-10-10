import { test } from 'node:test';
import assert from 'node:assert/strict';
import { LANGUAGES, isLanguage, message, translate, translations } from './translations.ts';

test('language preference accepts exactly the four requested languages', () => {
  assert.deepEqual(LANGUAGES.map(item => item.code), ['en', 'mr', 'hi', 'ja']);
  for (const language of ['en', 'mr', 'hi', 'ja']) assert.equal(isLanguage(language), true);
  for (const invalid of ['fr', '', null, 'EN']) assert.equal(isLanguage(invalid), false);
});
test('every supported non-English language has a translation for every interface key', () => {
  assert.ok(Object.keys(translations).length > 150);
  for (const row of Object.values(translations)) for (const language of ['mr', 'hi', 'ja']) assert.ok(row[language]?.trim());
});
test('personal text and record values are preserved while dynamic values interpolate', () => {
  for (const language of ['en', 'mr', 'hi', 'ja']) {
    assert.equal(translate(language, 'Personal record 42'), 'Personal record 42');
    assert.ok(message(language, 'entries', {count: 42}).includes('42'));
  }
});
