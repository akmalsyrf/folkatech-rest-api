# FOLKATECH REST API

### [Link dokumentasi postman ](https://documenter.getpostman.com/view/18883374/UzJPMaMg)

### Command

- `docker build -t folkatech-rest-api:0.0.1 .`
- `docker network create folkatech-rest-api-network`
- `docker run -p 27017:27017 --network folkatech-rest-api-network -d --name mongo -t mongo:latest`
- `docker run -p 3000:3000 --network folkatech-rest-api-network -d folkatech-rest-api:0.0.1`
