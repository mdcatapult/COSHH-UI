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
Development and branches:
```bash
CLIENT_ORIGIN_URL: "$DEV_CLIENT_ORIGIN_URL"
AUTH0_DOMAIN: "$DEV_AUTH0_DOMAIN"
AUTH0_AUDIENCE: "$DEV_AUTH0_AUDIENCE"
AUTH0_CLIENT_ID: "$DEV_AUTH0_CLIENT_ID"
DEPLOYMENT_ENV: "dev"
BACKEND_URL: "$DEV_BACKEND_URL"
```
Master:
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




### Attributions

<a href="https://www.flaticon.com/free-icons/flammable" title="flammable icons">Flammable icons created by Freepik - Flaticon</a>