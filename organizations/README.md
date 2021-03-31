![Node.js CI](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Organizations/workflows/Node.js%20CI/badge.svg)   
# Microservice - Organizations
## Larrosa-Settimo-Zawrzykraj

This service allows to create organizations, systems, and environments with it's `keyConnection` token:
* Publishes messages with the following topics.
    * `organization.create` when an organization is created.   
    * `system.create` when a system is created.   
    * `environment.create` when an environment is created.   


## Available endpoints   

### POST /api/v1/organizations
Saves a new Organization into the system.

### GET /api/v1/organizations
Get all Organizations from the system.

### GET /api/v1/organizations/id
Gets Organizations with `id` from the system.

### POST /api/v1/systems
Saves a new system to logged user organization.

### GET /api/v1/systems
Get all systems for the logged user organization.

### POST /api/v1/systems/id/environments
Saves a new environment to system with `id`.

### GET /api/v1/systems/id/environments
Get all new environments for system with `id`.

### GET /api/v1/organizations/ping
Returns the status health of the microservice and it's dependencies.


