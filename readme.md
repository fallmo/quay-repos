# List quay repositories for copying

This repo contains nodejs code that will use browser automation to list the repositories for a quay user.
The list of repositories can then be used in a for loop (for example) to copy images from one repository to the other.

# Prerequisites

- nodejs (version 16+) installed

# Structure

```
.
└── quay-repos/
  ├── login.js # script that logs into browser and saved token
  ├── list.js  # script that goes to registries and lists repos
  └── copy.js  # script that copies listed repos to destination registry
```

# Usage Steps

1. run npm install to install depencencies.

```
npm install
```

2. create a directory to store browser data.

```
mkdir browser-data
```

3. Create an .env file containing registry information.

```
SRC_REGISTRY_URL=https://<replace>:8443
SRC_REGISTRY_USERNAME=<replace>
SRC_REGISTRY_PASSWORD=<replace>
DEST_REGISTRY_URL=https://<replace>:8443
DEST_REGISTRY_USERNAME=<replace>
DEST_REGISTRY_PASSWORD=<replace>
DEBUG=false
```

4. Run the login script to `login.js` to the registry and have it saved in browser data.

```
node login.js
```

5. Run the `list.js` script to list the repositories for the user. The script creates a file `repos.txt` with a list of the repos.

```
node list.js
```

6. Run the `copy.js` script to copy repositories from the `repos.txt` to the destination registry.

> Inside the `copy.js` file, there is a `--dry-run` inside the copy command. Be sure to remove it to actually complete the copying.

```
node copy.js
```
