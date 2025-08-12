import { test, expect, Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

async function answerAllQuestions(page, values: number[] = [1,1,1,1,1,1,1,1,0]) {
  for (let i = 1; i <= 9; i++) {
    await page.locator(`.question >> input[name="q${i}"][value="${values[i-1]}"]`).check();
  }
}

async function selectChip(page: Page, text: string) {
  await page.locator('label.chip', { hasText: text }).click();
}

test.describe('MindCheck symptom checker', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL! + '/index.html');
    await expect(page.locator('h1.site-title')).toHaveText('MindCheck');
  });

  test('requires all questions before submission', async ({ page }) => {
    await page.getByRole('button', { name: 'Check my results' }).click();
    await expect(page.locator('#formError')).toContainText('Please answer all questions');
  });

  test('submits, shows score and guidance, and renders matches', async ({ page }) => {
    // Select some optional symptoms to drive matches for MDD/GAD
    await selectChip(page, 'Low mood');
    await selectChip(page, 'Loss of interest');
    await selectChip(page, 'Anxiety or worry');

    await answerAllQuestions(page, [2,2,1,1,1,1,1,1,0]);

    await page.getByRole('button', { name: 'Check my results' }).click();

    await expect(page.locator('#results')).toBeVisible();
    await expect(page.locator('#scoreSummary')).toContainText('Total score:');
    await expect(page.locator('#guidance')).toBeVisible();

    const matches = page.locator('.match-item');
    expect(await matches.count()).toBeGreaterThan(0);

    // Top match should contain a Learn more link and description
    const first = matches.first();
    await expect(first.getByRole('heading')).toBeVisible();
    await expect(first.locator('.desc')).toBeVisible();
    await expect(first.getByRole('link', { name: /Learn more/i })).toBeVisible();
  });

  test('navigates to details page and loads content based on slug', async ({ page, baseURL }) => {
    // Drive a match for Major Depressive Disorder
    await selectChip(page, 'Low mood');
    await selectChip(page, 'Loss of interest');
    await answerAllQuestions(page, [3,3,0,0,1,1,1,1,0]);
    await page.getByRole('button', { name: 'Check my results' }).click();

    const link = page.getByRole('link', { name: 'Learn more' }).first();
    const href = await link.getAttribute('href');
    await link.click();

    await page.waitForURL('**/details.html**');
    await expect(page.locator('h1#title')).not.toHaveText('Loading…');
    await expect(page.locator('#description')).not.toHaveText('Loading…');
    await expect(page.locator('#symptoms .pill').first()).toBeVisible();

    // Validate the slug param was used
    const url = new URL(page.url());
    expect(url.pathname.endsWith('/details.html')).toBeTruthy();
    expect(url.searchParams.get('d')).toBeTruthy();
  });

  test('risk flag guidance when q9 > 0', async ({ page }) => {
    await answerAllQuestions(page, [0,0,0,0,0,0,0,0,1]);
    await page.getByRole('button', { name: 'Check my results' }).click();
    await expect(page.locator('#guidance')).toContainText('self-harm');
  });

  test('reset hides results and clears messages', async ({ page }) => {
    await answerAllQuestions(page);
    await page.getByRole('button', { name: 'Check my results' }).click();
    await expect(page.locator('#results')).toBeVisible();
    await page.getByRole('button', { name: 'Reset' }).click();
    await expect(page.locator('#results')).toBeHidden();
    await expect(page.locator('#scoreSummary')).toHaveText('');
  });

  test('basic accessibility checks with axe', async ({ page }) => {
    await answerAllQuestions(page);
    await page.getByRole('button', { name: 'Check my results' }).click();

    const results = await new AxeBuilder({ page }).analyze();
    // Allow zero or low-severity violations in CI environments; fail only on serious/critical
    const serious = results.violations.filter(v => ['serious','critical'].includes(v.impact || ''));
    expect(serious).toEqual([]);
  });
});