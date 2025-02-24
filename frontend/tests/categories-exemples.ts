import { test, expect } from '@playwright/test';

test.describe('Categories E2E', () => {
  // Before each test, navigate to the Categories page.
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/');
  });

  test('should add a new category', async ({ page }) => {
    // Click the "Add Category" button to open the modal.
    await page.getByRole('button', { name: /add category/i }).click();

    // Verify the "Create New Category" modal is visible.
    await expect(page.getByText('Create New Category')).toBeVisible();

    // Fill in the form fields.
    await page.fill('input#name', 'Test Category');
    await page.fill('textarea#description', 'This is a test category.');

    // Submit the form.
    await page.getByRole('button', { name: /submit/i }).click();

    // Optionally, wait for the modal to disappear (if your modal closes on submit).
    await expect(page.getByText('Create New Category')).toHaveCount(0);

    // Check that the new category appears in the list.
    await expect(page.getByText('Test Category')).toBeVisible();
  });

  test('should update an existing category', async ({ page }) => {
    // Ensure that a category with the name "Test Category" exists.
    const categoryCard = page.getByText('Test Category').first();
    await expect(categoryCard).toBeVisible();

    // Find the parent card container and click the menu button.
    // This selector uses the fact that the menu button is rendered as an IconButton.
    const cardContainer = categoryCard.locator('xpath=ancestor::div[contains(@class, "chakra-card")]');
    await cardContainer.locator('button').first().click();

    // From the dropdown, click on "Edit".
    await page.getByRole('menuitem', { name: /edit/i }).click();

    // The update modal should appear.
    await expect(page.getByText('Update Category')).toBeVisible();

    // Change the category name.
    await page.fill('input#name', 'Updated Category');

    // Submit the update form.
    await page.getByRole('button', { name: /submit/i }).click();

    // Verify that the updated category name appears in the list.
    await expect(page.getByText('Updated Category')).toBeVisible();
  });

  test('should delete an existing category', async ({ page }) => {
    // Assume that "Updated Category" now exists.
    const categoryCard = page.getByText('Updated Category').first();
    await expect(categoryCard).toBeVisible();

    // Find the parent card container and open its menu.
    const cardContainer = categoryCard.locator('xpath=ancestor::div[contains(@class, "chakra-card")]');
    await cardContainer.locator('button').first().click();

    // Click the "Delete" option from the dropdown.
    await page.getByRole('menuitem', { name: /delete/i }).click();

    // Verify that the category is no longer visible.
    await expect(page.getByText('Updated Category')).toHaveCount(0);
  });
});
