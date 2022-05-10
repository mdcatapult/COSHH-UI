1) `docker-compose up -d`
2) `cd ui && ng s`

You may need to `npm i` if running for the first time, and `npm install -g @angular/cli` if you don't have Angular.

### Running Tests Locally

```
docker-compose up db -d
cd api
go test -v ./... -p 1
```
