import { test, expect, Page } from '@playwright/test';

async function answerAllQuestions(page: Page, values: number[] = [1,1,1,1,1,1,1,1,0]) {
  for (let i = 1; i <= 9; i++) {
    await page.locator(`.question >> input[name="q${i}"][value="${values[i-1]}"]`).check();
  }
}

async function selectChip(page: Page, text: string) {
  await page.locator('label.chip', { hasText: text }).click();
}

test.describe('MindCheck extended coverage', () => {
  test.beforeEach(async ({ page, baseURL }) => {
    await page.goto(baseURL! + '/index.html');
  });

  test('no optional symptoms yields zero or minimal matches list', async ({ page }) => {
    await answerAllQuestions(page, [0,0,0,0,0,0,0,0,0]);
    await page.getByRole('button', { name: 'Check my results' }).click();

    const matchesSection = page.locator('#matches');
    // Either empty (hidden via CSS) or populated; ensure it exists and app didn't crash
    await expect(matchesSection).toBeAttached();
  });

  test('tags render with spaces instead of underscores', async ({ page }) => {
    await selectChip(page, 'Low mood');
    await selectChip(page, 'Loss of interest');
    await answerAllQuestions(page, [2,2,1,1,1,1,1,1,0]);
    await page.getByRole('button', { name: 'Check my results' }).click();

    const firstTag = page.locator('.match-item .tags .tag').first();
    await expect(firstTag).toBeVisible();
    const text = await firstTag.textContent();
    expect(text).not.toContain('_');
  });

  test('details page handles unknown slug gracefully', async ({ page, baseURL }) => {
    await page.goto(baseURL! + '/details.html?d=unknown-slug');
    await expect(page.locator('h1#title')).toHaveText('Not found');
    await expect(page.locator('#description')).toContainText('not found');
  });

  test('details page shows emergency resources section', async ({ page, baseURL }) => {
    await page.goto(baseURL! + '/details.html?d=major-depressive-disorder');
    await expect(page.locator('#threatEmergency')).toBeVisible();
  });
});