![Node.js CI](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-Notifications/workflows/Node.js%20CI/badge.svg)

# Microservice - Notifications
## Larrosa-Settimo-Zawrzykraj

This microservice allows users to create and update notification preferences.
* Publishes messages with the following topics:
    *  `notification.email` when a new email needs to be sent.

* Listens for messages with the following topics:
    * `bug.update` This checks if he bug has been asigned to a user and creates new record in the database if needed.

## Available endpoints   

### POST /api/v1/preferences
This endpoint receives notifications preferences creation or updates for the logged user.

### GET /api/v1/prefereces
Returns a list of notification preferences for the loggeed user.

### POST /api/v1/preferences/general
Enables or disables the general preference to receive 2 days open bugs report.

### GET /api/v1/prefereces
Returns the status of the general preference.

### GET /api/v1/MailSender/ping
Returns the health status of the microservice and it's dependencies.

### GET /api/v1/MailSender/info
Returns the microservice name.

## Available scripts
    * `npm run start` Launches the Microservice.