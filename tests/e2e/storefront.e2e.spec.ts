import { test, expect } from '@playwright/test'
test('storefront links to collection and account', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
  await page.getByRole('link', { name: 'Explore the collection', exact: true }).first().click()
  await expect(page).toHaveURL(/\/shop/)
  await expect(page.getByRole('heading', { level: 1 })).toContainText('collection')
})
