FROM node:14-alpine as build

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

RUN npm install -g @angular/cli

COPY . .

RUN ng build

FROM nginx:1.21-alpine

COPY --from=build app/dist/coshh /usr/share/nginx/html

EXPOSE 80
