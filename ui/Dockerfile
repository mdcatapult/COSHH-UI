FROM node:14-alpine

WORKDIR /app

COPY package.json ./

COPY package-lock.json ./

RUN npm install

RUN npm install -g @angular/cli

EXPOSE 4200

COPY . .

CMD ["ng", "s"]
