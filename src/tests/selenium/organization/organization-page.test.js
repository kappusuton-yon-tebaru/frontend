const { Builder, By, until } = require("selenium-webdriver");
const chrome = require("selenium-webdriver/chrome");

console.log("Running Organization page test...");

let driver;

async function testOrganizationPage() {
  driver = await new Builder()
    .forBrowser("chrome")
    .setChromeOptions(new chrome.Options())
    .build();

  try {
    await driver.get(
      "http://localhost:3000/organization/678fcf897c67bca50cfae34e"
    );
    console.log("Navigated to organization page");

    // Wait for the organization title
    const title = await driver.wait(
      until.elementLocated(By.css('[data-testid="org-title"]')),
      5000
    );
    await driver.wait(until.elementIsVisible(title), 5000);
    const titleText = await title.getText();
    console.log("Org name:", titleText);

    // Check owner
    const owner = await driver.findElement(By.css('[data-testid="org-owner"]'));
    const ownerText = await owner.getText();
    console.log("Org Owner:", ownerText);

    // Check buttons
    const manageBtn = await driver.findElement(
      By.css('[data-testid="manage-org"]')
    );
    const manageBtnEnabled = await manageBtn.isEnabled();
    const newProjectBtn = await driver.findElement(
      By.css('[data-testid="new-projspace"]')
    );
    const newProjectBtnEnabled = await newProjectBtn.isEnabled();
    console.log("Buttons are visible");
    if (manageBtnEnabled && newProjectBtnEnabled) {
      console.log("Buttons are enabled");
    } else {
      console.log("Buttons are disabled");
    }

    // Check search bar
    const searchBar = await driver.findElement(
      By.css('[data-testid="search-bar"]')
    );
    const searchIcon = await driver.findElement(
      By.css('[data-testid="search-icon"]')
    );
    const searchInput = await driver.findElement(
      By.css('[data-testid="search-text"]')
    );
    await searchInput.sendKeys("test");
    console.log("Search bar is visible");

    // Check sorting
    const sortButton = await driver.findElement(
      By.css('[data-testid="sort-button"]')
    );
    const sortByText = await driver.findElement(
      By.css('[data-testid="sort-by"]')
    );
    const sorting = await driver.findElement(By.css('[data-testid="sorting"]'));
    const sortOrder = await driver.findElement(
      By.css('[data-testid="sort-order"]')
    );
    const sortOrderText = await sortOrder.getText();
    if (sortOrderText == "Ascending") {
      sortOrder.click();
      const sortOrderAfter = await driver.findElement(
        By.css('[data-testid="sort-order"]')
      );
      const sortOrderTextAfterclick = await sortOrderAfter.getText();
      if (sortOrderTextAfterclick == "Descending") {
        console.log("Sort Order Button is OK");
      } else {
        console.log("Sort Order Button is not OK");
      }
    } else if (sortOrderText == "Descending") {
      sortOrder.click();
      const sortOrderAfter = await driver.findElement(
        By.css('[data-testid="sort-order"]')
      );
      const sortOrderTextAfterclick = await sortOrderAfter.getText();
      if (sortOrderTextAfterclick == "Ascending") {
        console.log("Sort Order Button is OK");
      } else {
        console.log("Sort Order Button is not OK");
      }
    }
    console.log("Sort Manager is visible");

    // Pagination
    const pagination = await driver.findElement(
      By.css('[data-testid="pagination"]')
    );
    console.log("Pagination is visible");

    console.log("Organization page test completed successfully");
  } catch (err) {
    console.error("Test failed:", err);
    throw err;
  } finally {
    if (driver) {
      await driver.quit();
      console.log("WebDriver closed");
    }
  }
}

// Execute the test
testOrganizationPage().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
