FROM node:14-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

ARG CLIENT_ORIGIN_URL
ARG AUTH0_DOMAIN
ARG AUTH0_AUDIENCE
ARG AUTH0_CLIENT_ID
ARG DEPLOYMENT_ENV
ARG BACKEND_URL

RUN npm run build-prod

FROM nginx:1.21-alpine

COPY --from=build app/dist/coshh /usr/share/nginx/html

EXPOSE 80
