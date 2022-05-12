run:
	docker-compose pull
	docker-compose up -d
	cd ui; ng s

test: 
	docker-compose pull
	docker-compose up -d db
	cd api; go test ./... -p 1
