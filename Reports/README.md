![Node.js CI](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Reports/workflows/Node.js%20CI/badge.svg)

# Microservice - Reports
## Larrosa-Settimo-Zawrzykraj

This microservice allows users to obtain reports for their organization.
* Listens for messages with the following topics:
    *  `bug.create` saves the information when a bug is created.
    *  `bug.update` saved the updated information when a bug is updated.
    *  `user.create` saves the information when a bug is created.

## Available endpoints   

### GET /api/v1/reports/critical
This endpoint returns the report of the 5 error that are not resolved with the highest severity

### GET /api/v1/reports/statistics?dateFrom=`01/10/2020`&dateTo=`19/10/2020`
This endpoint returns the report of bugs statistics between to dates

### GET /api/v1/reports/bugs/topUsers/solved
This endpoint returns the report of the top 10 users that had resolved more bugs in the lasts 30 days.

### GET /api/v1/reports/bugs/notAssigned
This endpoint returns the report of the bugs that had been assigned for more than 2 days.

### GET /api/v1/reports/ping
Returns the health status of the microservice and it's dependencies.

### GET /api/v1/reports/info
Returns the microservice name.

## Available scripts
    * `npm run start` Launches the Microservice.
    * `npm run queueProcessor` Launches the worker that processs the incomming queued messages.