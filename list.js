const puppeteer = require("puppeteer");
const dotenv = require("dotenv");
const fs = require("fs/promises");
const {
  logIfDebug,
  wait,
  selectors,
  SRC_REGISTRY_URL,
  SRC_REGISTRY_USERNAME,
} = require("./utils");

dotenv.config();

logIfDebug("REGISTRY_URL: ", SRC_REGISTRY_URL, "\n");
logIfDebug("REGISTRY_USERNAME: ", SRC_REGISTRY_USERNAME, "\n");

if (!SRC_REGISTRY_URL) {
  console.log(`REGISTRY_URL missing.`);
  process.exit(1);
}

if (!SRC_REGISTRY_USERNAME) {
  console.log(`REGISTRY_USERNAME missing.`);
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
  await page.setViewport({ width: 1300, height: 1080 });

  await page.goto(SRC_REGISTRY_URL, {});
  await wait(2000);

  try {
    await page.$eval(selectors.user_dropdown, (el) => {
      console.log(el);
    });
    logIfDebug("Is indeed logged in...");
  } catch (err) {
    console.log(err);
    console.log("Not logged in.");
    await page.close();
  }

  await page.waitForSelector(selectors.repos_info_btn);

  const repos_info = await page.$eval(selectors.repos_info_btn, (el) => {
    return el.innerText;
  });

  const [_info, total_repos] = repos_info.split(" of ");
  logIfDebug("Total Repos: ", total_repos);

  let isComplete = false;
  let repos = [];
  do {
    const repo_names = await page.$$eval(selectors.repo_name, (els) => {
      return els.map((el) => el.innerText);
    });

    repo_names.flat().forEach((name) => {
      const repo_name = `${SRC_REGISTRY_URL.replace(
        "https://",
        ""
      )}/${SRC_REGISTRY_USERNAME}/${name}`;
      repos.push(repo_name);
      console.log(repo_name);
    });

    isComplete = await page.$eval(selectors.next_repos_btn, (el) => {
      return el.disabled;
    });
    if (!isComplete) {
      await page.click(selectors.next_repos_btn);
      await wait(5000);
    } else {
      console.log("Listing repos complete...");
      logIfDebug("Writing repos to file repos.txt");
      await fs.writeFile("./repos.txt", repos.join("\n"), {
        encoding: "utf-8",
      });
      console.log("Repos written to repos.txt");
      await page.close();
    }
  } while (!isComplete);
})();
