const {
  logIfDebug,
  SRC_REGISTRY_URL,
  SRC_REGISTRY_USERNAME,
  SRC_REGISTRY_PASSWORD,
  DEST_REGISTRY_URL,
  DEST_REGISTRY_USERNAME,
  DEST_REGISTRY_PASSWORD,
  asyncExec,
} = require("./utils");

const fs = require("fs/promises");

logIfDebug("SRC_REGISTRY_URL: ", SRC_REGISTRY_URL, "\n");
logIfDebug("SRC_REGISTRY_USERNAME: ", SRC_REGISTRY_USERNAME, "\n");

logIfDebug("DEST_REGISTRY_URL: ", DEST_REGISTRY_URL, "\n");
logIfDebug("DEST_REGISTRY_USERNAME: ", DEST_REGISTRY_USERNAME, "\n");

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

if (!DEST_REGISTRY_URL) {
  console.log(`DEST_REGISTRY_URL missing.`);
  process.exit(1);
}

if (!DEST_REGISTRY_USERNAME) {
  console.log(`DEST_REGISTRY_USERNAME missing.`);
  process.exit(1);
}

if (!DEST_REGISTRY_PASSWORD) {
  console.log(`DEST_REGISTRY_PASSWORD missing.`);
  process.exit(1);
}

(async () => {
  logIfDebug("Loading repos file...");
  let file;
  try {
    file = await fs.readFile("./repos.txt", { encoding: "utf-8" });
  } catch (err) {
    console.log(err);
  }

  if (!file) {
    console.log("Failed to load repos.txt file");
    return;
  }
  const repos = file.split("\n");

  console.log(`Copying ${repos.length} repos`);

  const src_registry = SRC_REGISTRY_URL.replace("https://", "").replace(
    "http://"
  );

  const dest_registry = DEST_REGISTRY_URL.replace("https://", "").replace(
    "http://"
  );

  for (let i = 0; i < repos.length; i++) {
    const [_registry, _user, repo] = repos[i].split("/");
    console.log(
      `Init Copy ${i + 1}/${repos.length} (${SRC_REGISTRY_USERNAME}/${repo})...`
    );
    try {
      const stdout = await asyncExec(
        [
          "skopeo sync",
          "--all --preserve-digests --keep-going --src docker --dest docker",
          "--dry-run", // remove to actually run
          `--src-username ${SRC_REGISTRY_USERNAME} --src-password ${SRC_REGISTRY_PASSWORD}`,
          `--dest-username ${DEST_REGISTRY_USERNAME} --dest-password ${DEST_REGISTRY_PASSWORD}`,
          `${src_registry}/${SRC_REGISTRY_USERNAME}/${repo} ${dest_registry}/${DEST_REGISTRY_USERNAME}`,
        ].join(" ")
      );
      console.log(stdout);
      console.log(
        `Success Copy ${i + 1}/${
          repos.length
        } (${SRC_REGISTRY_USERNAME}/${repo})...`
      );
    } catch (err) {
      console.log(err);
      console.log(
        `Failed Copy ${i + 1}/${
          repos.length
        } (${SRC_REGISTRY_USERNAME}/${repo})...`
      );
    }
  }

  console.log("All copy complete...");
})();
