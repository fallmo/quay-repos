const dotenv = require("dotenv");

dotenv.config();

const SRC_REGISTRY_URL = process.env.SRC_REGISTRY_URL;
const SRC_REGISTRY_USERNAME = process.env.SRC_REGISTRY_USERNAME;
const SRC_REGISTRY_PASSWORD = process.env.SRC_REGISTRY_PASSWORD;

const DEST_REGISTRY_URL = process.env.DEST_REGISTRY_URL;
const DEST_REGISTRY_USERNAME = process.env.DEST_REGISTRY_USERNAME;
const DEST_REGISTRY_PASSWORD = process.env.DEST_REGISTRY_PASSWORD;

const selectors = {
  login_input: "input#signin-username",
  login_password: "input#signin-password",
  login_button:
    "#co-l-view-container > div > div:nth-child(2) > div > div > div > div > div > div > div.user-setup-content > div > div > div:nth-child(2) > div > div > form > button",
  user_dropdown: "a.dropdown-toggle.user-dropdown.user-view",
  next_repos_btn:
    "#co-l-view-container > div > div:nth-child(2) > div > div.row > div.col-lg-9.col-lg-pull-3.col-md-9.col-md-pull-3.col-sm-12 > div > div > div > div.repo-list-table > div > div > span > span > div > span.page-buttons.btn-group > button:nth-child(2)",
  repos_info_btn:
    "#co-l-view-container > div > div:nth-child(2) > div > div.row > div.col-lg-9.col-lg-pull-3.col-md-9.col-md-pull-3.col-sm-12 > div > div > div > div.repo-list-table > div > div > span > span > div > span.current-items.dropdown > span.page-view",
  repo_name: "tr td.repo-name-icon a span.name",
};

function wait(ms = 2000) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

function logIfDebug(...text) {
  if (process.env.DEBUG === "true") console.log(...text);
}

module.exports = {
  selectors,
  wait,
  logIfDebug,
  SRC_REGISTRY_URL,
  SRC_REGISTRY_USERNAME,
  SRC_REGISTRY_PASSWORD,
  DEST_REGISTRY_URL,
  DEST_REGISTRY_USERNAME,
  DEST_REGISTRY_PASSWORD,
};
