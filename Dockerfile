FROM node:22-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci

RUN npm install -g @angular/cli@18.0.1

COPY . .

ENV SERVICE_NAME="coshh-ui-service"

RUN addgroup --gid 1001 -S $SERVICE_NAME && \
    adduser -G $SERVICE_NAME --shell /bin/false --disabled-password -H --uid 1001 $SERVICE_NAME

ARG CLIENT_ORIGIN_URL
ARG AUTH0_DOMAIN
ARG AUTH0_AUDIENCE
ARG AUTH0_CLIENT_ID
ARG DEPLOYMENT_ENV
ARG BACKEND_URL

RUN npm run build-prod

USER $SERVICE_NAME

FROM nginx:1.27-alpine

USER $SERVICE_NAME

COPY --from=build app/dist/coshh/browser /usr/share/nginx/html

EXPOSE 80
