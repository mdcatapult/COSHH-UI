const { writeFile } = require('fs');
const { argv } = require('yargs');

// read environment variables from .env file
require('dotenv').config();

// read the command line arguments passed with yargs
const isProduction = process.env["DEPLOYMENT_ENV"] === 'prod'
const targetPath = isProduction
    ? `./src/environments/environment.prod.ts`
    : `./src/environments/environment.ts`;

// we have access to our environment variables
// in the process.env object thanks to dotenv
const environmentFileContent = `
export const environment = {
   production: ${isProduction},
   backendUrl: "${process.env["BACKEND_URL"]}",
   auth0: {
      clientId: "${process.env["AUTH0_CLIENT_ID"]}",
      domain: "${process.env["CLIENT_DOMAIN"]}",
      authorizationParams: {
          redirect_uri: window.location.origin,
          audience: "${process.env["AUTH0_AUDIENCE"]}"
      }
   }
};
`;

// write the content to the respective file
writeFile(targetPath, environmentFileContent, function (err: any) {
    if (err) {
        console.log(err);
    }

    console.log(`Wrote variables to ${targetPath}`);
});