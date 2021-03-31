![Node.js CI](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Users/workflows/Node.js%20CI/badge.svg)

# Microservice - Users
## Larrosa-Settimo-Zawrzykraj

This endpoint allows to create users and users with organizations.  
It also creates invitations for users and allows to confirm invitations to create a new users   
* Publishes messages with the following topics:
    *  `user.create` when a user is created   
    *  `notification.email` when a new invitation is generated

## Available endpoints


### POST /api/v1/users
Creates a new admin user with a new organization

### GET /api/v1/users
Returns a list of users for the loggeed user organization

### POST /api/v1/login
Generates an authentication token for a logged user

### POST /api/v1/invitations
Create a new invitation to the logged user organization

### GET /api/v1/invitations/id
Returns information of a previously created invitation with `id`

### POST /api/v1/invitations/id
Accepts an invitation with `id`

### GET /api/v1/authorization/validate
Valida que un token sea correcto  
Retorna 200 OK si el token el correcto