# List quay repositories for copying

This repo contains nodejs code that will use browser automation to list the repositories for a quay user.
The list of repositories can then be used in a for loop (for example) to copy images from one repository to the other.

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

1. Run the `copy.js` script to copy repositories from the `repos.txt` to the destination registry.

```
node copy.js
```
