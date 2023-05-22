const { writeFile } = require('fs');

// read environment variables from .env file
require('dotenv').config();

const isProduction = process.env["DEPLOYMENT_ENV"] === 'prod'

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
writeFile(`./src/environments/environment.ts`, environmentFileContent, function (err: any) {
    if (err) {
        console.log(err);
    }
});