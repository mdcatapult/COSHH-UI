FROM node:14-alpine as build

# Folders created by WORKDIR are owned by rooteven if created after a USER directive.
# To get around this, create the folder first.
#RUN mkdir /app

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

RUN npm install -g @angular/cli

#Alpine images have a generic user already bundled
#RUN chown -R node:node /app
#USER node

COPY . .

ARG CLIENT_ORIGIN_URL
ARG AUTH0_DOMAIN
ARG AUTH0_AUDIENCE
ARG AUTH0_CLIENT_ID
ARG DEPLOYMENT_ENV
ARG BACKEND_URL

RUN npm run build-prod

FROM nginx:1.21-alpine

#USER node

COPY --from=build app/dist/coshh /usr/share/nginx/html

EXPOSE 80
