FROM node:14-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm ci --only=production

RUN npm install -g @angular/cli

ENV SERVICE_NAME="coshh-ui-service"

RUN addgroup --gid 1001 -S $SERVICE_NAME && \
    adduser -G $SERVICE_NAME --shell /bin/false --disabled-password -H --uid 1001 $SERVICE_NAME && \
    mkdir -p /var/log/$SERVICE_NAME && \
    chown $SERVICE_NAME:$SERVICE_NAME /var/log/$SERVICE_NAME

USER $SERVICE_NAME

COPY . .

ARG CLIENT_ORIGIN_URL
ARG AUTH0_DOMAIN
ARG AUTH0_AUDIENCE
ARG AUTH0_CLIENT_ID
ARG DEPLOYMENT_ENV
ARG BACKEND_URL

RUN npm run build-prod

FROM nginx:1.21-alpine

USER $SERVICE_NAME

COPY --from=build app/dist/coshh /usr/share/nginx/html

EXPOSE 80
