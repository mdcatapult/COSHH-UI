### Running

`make run`

You may need to `npm i` if running for the first time, and `npm install -g @angular/cli` if you don't have Angular.

By default, the app starts with no data. To populate the app, follow the [ETL guide](etl/README.md).

### Debugging
You can run it all using the docker-compose file (use within the `make run` task above) or start up your locally changed versions of the components. 
To run your local versions you  need to tell the backend what database connection params to use and where the file detailing the different lab names is.

```bash
export DBNAME=informatics \
export HOST=localhost \
export PASSWORD=postgres \
export PORT=5432 \
export USER=postgres \
export LABS_CSV="/Users/my.name/IdeaProjects/coshh/api/labs.csv"
``` 

Start the database:
```bash
docker-compose up db
``` 

Start the API:
```bash
cd api
go run main.go
```

Start the UI:
```bash
cd ui
ng s
```

Go to `http://localhost:4000` in your browser.

### Testing

`make test`
