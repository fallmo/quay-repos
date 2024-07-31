const puppeteer = require("puppeteer");
const {
  logIfDebug,
  wait,
  selectors,
  SRC_REGISTRY_URL,
  SRC_REGISTRY_USERNAME,
  SRC_REGISTRY_PASSWORD,
} = require("./utils");

logIfDebug("SRC_REGISTRY_URL: ", SRC_REGISTRY_URL, "\n");
logIfDebug("SRC_REGISTRY_USERNAME: ", SRC_REGISTRY_USERNAME, "\n");

if (!SRC_REGISTRY_URL) {
  console.log(`SRC_REGISTRY_URL missing.`);
  process.exit(1);
}

if (!SRC_REGISTRY_USERNAME) {
  console.log(`SRC_REGISTRY_USERNAME missing.`);
  process.exit(1);
}

if (!SRC_REGISTRY_PASSWORD) {
  console.log(`SRC_REGISTRY_PASSWORD missing.`);
  process.exit(1);
}

(async () => {
  logIfDebug("Initializing browser...");
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
    userDataDir: "./browser-data",
    slowMo: 3,
    args: ["--start-maximized"],
  });

  const pages = await browser.pages();
  const page = pages[0];
  await page.setViewport({ width: 1920, height: 1080 });

  logIfDebug("Opening registry page...");
  await page.goto(SRC_REGISTRY_URL, {});

  try {
    await page.$eval(selectors.user_dropdown, (el) => {
      console.log(el);
    });
    console.log("Is already logged in..");
    await page.close();
  } catch (err) {
    logIfDebug("Not logged in...");
  }

  await page.waitForSelector(selectors.login_input);
  await page.waitForSelector(selectors.login_password);
  await page.waitForSelector(selectors.login_button);
  logIfDebug("Registry page ready...");

  logIfDebug("Logging in...");
  await page.type(selectors.login_input, SRC_REGISTRY_USERNAME);
  await page.type(selectors.login_password, SRC_REGISTRY_PASSWORD);
  await page.click(selectors.login_button);
  try {
    await page.waitForNavigation({ timeout: 10000 });
    logIfDebug("Login successful...");
    await wait(2000);
    await page.close();
  } catch (err) {
    console.log("Failed to login automatically, login manually...");
  }
})();
