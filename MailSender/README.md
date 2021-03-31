![Node.js CI](https://github.com/ArqSoftPractica/Larrosa-Settimo-Zawrzykraj-MailSender/workflows/Node.js%20CI/badge.svg)

# Microservice - MailSender Worker
## Larrosa-Settimo-Zawrzykraj


This microservice worker is listening in the topic: `notification.email` and dispatches an email with the message content

## Available endpoints

### GET /api/v1/MailSender/ping
Returns the health status of the microservice and it's dependencies.

### GET /api/v1/MailSender/info
Returns the microservice name.   



The message arriving in the `notification.email` topic should have this structure:
```
    message = {
      address: 'AnEmailAddress@gmail.com'
      , subject: `An Email subject`
      , bodyText: `A regula email body in plain text`
      , bodyHTML: `An email body in HTML format`
    }
```

## Available scripts
    * `npm run start` Starts the Mailsender worker.
