import { test, expect } from "@playwright/test";

3//Need to separate em differents tests and use a aftercall to delete the category if the test fail

test.describe("Category and Task Management", () => {
    test.beforeEach(async ({ page }) => {
        await page.goto("http://localhost:5173");
    });

    test("should create, update, and delete a category with tasks", async ({
        page,
    }) => {
        const categoryName = "Test Category";
        const updatedCategoryName = "Updated Category";
        const taskName = "New Task";
        const updatedTaskName = "Updated Task";

        // Add new category
        await page.getByRole("button", { name: "Add Category" }).click();
        await page.getByLabel("Name").fill(categoryName);
        await page.getByLabel("Description").fill("Test Description");
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(
            page.getByRole("heading", { name: categoryName })
        ).toBeVisible();

        // Edit category
        const categoryCard = page.getByRole("heading", { name: categoryName });
        await categoryCard.locator("..").getByRole("button").click();
        await page.getByText("Edit").click();
        await page.getByLabel("Name").fill(updatedCategoryName);
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(
            page.getByRole("heading", { name: updatedCategoryName })
        ).toBeVisible();

        // Add task
        const updatedCategoryCard = page.getByRole("heading", {
            name: updatedCategoryName,
        });
        await updatedCategoryCard
            .locator("../../../..")
            .getByRole("button", { name: "Add Task" })
            .click();
        await page.getByLabel("Name").fill(taskName);
        await page.getByLabel("Description").fill("Task Description");
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(
            updatedCategoryCard.locator("../../../..").getByText(taskName)
        ).toBeVisible();

        // Edit task
        const taskCard = updatedCategoryCard
            .locator("../../../..")
            .getByText(taskName);
        await taskCard
            .locator("../../..")
            .getByRole("button", { name: "Edit Task" })
            .click();
        await page.getByLabel("Name").fill(updatedTaskName);
        await page.getByLabel("Status").selectOption("Completed");
        await page.getByRole("button", { name: "Submit" }).click();
        await expect(
            page.getByTestId("task-name").filter({ hasText: updatedTaskName })
        ).toBeVisible();
        await expect(
            page.getByTestId("task-status").filter({ hasText: "Completed" })
        ).toBeVisible();

        // Complete task
        await page.getByRole("button", { name: "Complete Task" }).click();
        await expect(
            page.getByTestId("task-status").filter({ hasText: "Completed" })
        ).toBeVisible();

        // Delete task
        await page.getByRole("button", { name: "Delete Task" }).click();
        await expect(taskCard).not.toBeVisible();

        // Delete category
        await updatedCategoryCard.locator("..").getByRole("button").click();
        await page.getByText("Delete").click();
        await expect(updatedCategoryCard).not.toBeVisible();
    });
});
