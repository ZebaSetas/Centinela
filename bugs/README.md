![Node.js CI](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Bugs/workflows/Node.js%20CI/badge.svg)

# Microservice - Bugs
## Larrosa-Settimo-Zawrzykraj

This microservice allows to create and update bugs.
* Publishes messages with the following topics:
    *  `bug.new` when a bug is queued to be stored.
    *  `bug.create` when a new bug is stored in the database.
    *  `bug.update` when any bug property is modified.

## Available endpoints   

### POST /api/v1/bugs
This endpoint received all the bugs to be stored in the database.

### GET /api/v1/bugs?state=`pending`&offset=`1`&limit=`30`
Returns a list of bugs for the loggeed user's organization.
    * Query params:
        * `state` (optional) could be `pending` or `completed`.
        * `offset` Starting number of the list of bugs to query.
        * `limit` The amount of bugs to be returned.

### GET /api/v1/bugs/id
Returns all the properties of a bug with `id`.

### POST /api/v1/bugs/id
Updates the properties of a bug with `id`.

### GET /api/v1/bugs/ping
Returns the status health of the microservice and it's dependencies.

### GET /api/v1/bugs/info
Returns the microservice name.   



## Available scripts
    * `npm run start` Launches the bug system WebApi.
    * `npm run bugProcessor` Launches the bug processor that listens for messages with `bug.new` topic.
    * `npm run queueProcessor` Launches the a queue processor that listest for messages with `environment.create` and `user.create` topics.