## COSHH UI

An Angular based webapp companion to the [COSHH API](https://gitlab.mdcatapult.io/informatics/coshh/coshh-api).

### Running

You may need to `npm i` if running for the first time, and `npm install -g @angular/cli` if you don't have Angular.

### Debugging
You will need the API up and running so see the [COSHH API](https://gitlab.mdcatapult.io/informatics/coshh/coshh-api) project for info on running it.

### Environment variables
Before running you need to create a `.env` file in the root directory containing the following.
```bash
CLIENT_ORIGIN_URL=http://localhost:4200
AUTH0_DOMAIN=mdcatapult.eu.auth0.com
AUTH0_AUDIENCE=https://coshh-api-local.wopr.inf.mdc
AUTH0_CLIENT_ID=kGE0VDjHYDaQvx977nCCe8e4GJbCfi41
BACKEND_URL=http://localhost:8080
DEPLOYMENT_ENV=dev
```
Set the values to the correct ones for your Auth0 application.  
The `start` and `build` commands use the `dotenv` package and a script in `scripts/setenv.ts` to read them in and create the correct `environment` file.:

If you don't create a `.env` file then you need to export them all to the environment you are running within:
```bash
export CLIENT_ORIGIN_URL=http://localhost:4020 \
export AUTH0_DOMAIN=mdcatapult.eu.auth0.com \
export AUTH0_AUDIENCE=https://coshh-api-local.wopr.inf.mdc \
export AUTH0_CLIENT_ID=kGE0VDjHYDaQvx977nCCe8e4GJbCfi41 \
export BACKEND_URL=http://localhost:8080 \
export DEPLOYMENT_ENV=dev
```

You can mix and match between the `.env` or environment as long as the build/start process has all 6 to read in.  
Any env vars that you export in your environment will override these even if they are contained in the `.env` file.

Remember to set to the env vars in your CI process so that they will be built into the container image.

### Start the UI:
```bash
npm run start
```

Go to `http://localhost:4200` in your browser.

### CI Environment Variables

Different env vars are used by the `publish-ui` and `publish-ui-master` stages so that the correct Auth0 details are passed in to the docker image.
Development and feature branches:
```bash
CLIENT_ORIGIN_URL: "$DEV_CLIENT_ORIGIN_URL"
AUTH0_DOMAIN: "$DEV_AUTH0_DOMAIN"
AUTH0_AUDIENCE: "$DEV_AUTH0_AUDIENCE"
AUTH0_CLIENT_ID: "$DEV_AUTH0_CLIENT_ID"
DEPLOYMENT_ENV: "dev"
BACKEND_URL: "$DEV_BACKEND_URL"
```
Main:
```bash
CLIENT_ORIGIN_URL: "$PROD_CLIENT_ORIGIN_URL"
AUTH0_DOMAIN: "$PROD_AUTH0_DOMAIN"
AUTH0_AUDIENCE: "$PROD_AUTH0_AUDIENCE"
AUTH0_CLIENT_ID: "$PROD_AUTH0_CLIENT_ID"
DEPLOYMENT_ENV: "prod"
BACKEND_URL: "$PROD_BACKEND_URL"
```

The CI stage `publish-ui-master` runs on a merge to `master` branch and uses the file called `Dockerfile` which uses `npm run build-prod` which then runs `ng build --configuration=production`.  
The CI stage `publish-ui` runs on `development` and other branches and uses `Dockerfile-dev` which runs `ng build --configuration=development`.  
Change things like `PROD_CLIENT_ORIGIN_URL` in the gitlab repo via `settings>CI/CD>Variables` to whatever Auth0 settings the app needs to use.

### Architecture
The main page including the table and nav bar is in the coshh component.  This subscribes to `filteredChemicals$` in the
chemicals service, which is the single source of truth where the chemicals retrieved from the API are stored in state and
filtered.

There are separate components for adding, cloning, editing and scanning chemicals, all of which use the chemical dialog
component.

The data service contains API calls and functions which return specific fields from the filtered chemicals list.

The expiry service contains functions which determine the expiry status of chemicals and set the background colour of the
chemicals (used in the expiry column) accordingly.

The save service contains functions to print and save the table.

The hazard service contains functions retrieving the hazard icons for a particular hazard and updating the hazards and
retrieving a hazard list for a particular chemical (hazards are stored in a separate table in the database).

The scanning service handles logic relating to barcode scanning and the dialog windows which open once a code has been
scanned.

### Scanning mode
Scanning mode is activated by clicking the scan button in the nav bar.  This effectively activates a listener which allows
the user to scan a barcode in order to archive a chemical.

If the scanned  barcode corresponds to a chemical number in the database a dialog opens prompting the user to confirm that
they would like to archive that chemical.  If the scanned barcode does not correspond to any chemical within the database,
or belongs to a chemical which has already been archived, a dialog wll notify the user of this.


A barcode scanner works like a keyboard, i.e. it does not interpret what the barcode is, it just ‘types’ out a string of
alpha-numeric characters that the barcode represents, ending with 'Enter'.  The coshh component contains a listener for
the 'Enter' key.  The scan button is automatically disabled when the user clicks on any filters or checkboxes, to avoid
any scanned numbers appearing in those inputs should focus be on those elements.

### Formatting conventions

#### Cupboard names
To attempt to maintain consistency as far as possible, when a user adds or edits a chemical, the cupboard name is lower 
cased prior to being sent to the API.  The `formatString` function in the utilities file is used to 'tidy' cupboard names, 
also trimming whitespace and removing consecutive duplicate whitespaces.  As the database may already contain cupboard 
names which have not been formatted, the `formatString` function is also used to format cupboard names when a cupboard name
filter is applied.


### Known Issues
- On Safari the chemical count is truncated to 2 characters.  This appears to be an incompatibility between Angular Material
and Safari and is not an issue in Chrome or Firefox.

### Attributions

<a href="https://www.flaticon.com/free-icons/flammable" title="flammable icons">Flammable icons created by Freepik - Flaticon</a>

### Licence

This project is licensed under the terms of the Apache 2 licence, which can be found in the repository as `LICENCE.txt`