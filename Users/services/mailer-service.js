const QueueService = require('./queue-service')
const config = require('config')
module.exports = class MailerService {
  constructor() {
    this.emailQueue = new QueueService(config.microservice_name)
  }

  async sendInvitationEmail(invitation) {
    let emailObject = {
      address: invitation.invitedEmail
      , subject: 'Invitacion a Centinela'
      , bodyText: newInvitationBodyText(invitation)
      , bodyHTML: newInvitationBodyHTML(invitation)
    }
    this.emailQueue.send('notification.email', emailObject)
  }
}

newInvitationBodyText = (invitation) => {
  `Has sido invitado a participar de Centinela
   Organizacion: ${invitation.organizationName}
   Correo: ${invitation.invitedEmail}
   Link: ${invitation.uri}
   Correo generado automáticamente por Centinela - Tu Bug Tracker favorito`
}

newInvitationBodyHTML = (invitation) => {
  return `<!DOCTYPE html>
  <html>
    <head>
      <style>
          table{
            border-collapse: collapse;
            align="center;
            max-width: 150px;
            table-layout: fixed;
              }
          th, td {
                padding: 10px;
                border-collapse: collapse;
              }
          .values {
              min-width: 10px;
              width: 25px;
              max-width: 25px;
              text-align:left;
          }
          .info {
              min-width: 50px;
              width: 100px;
              max-width: 150px;
          }  
      </style>
      <title>Invitacion a Centinela</title>
    </head>
    <body>
      <h1>Has sido invitado a unirte a Centinela</h1>
      <h3>Nombre de la Organizacion: <b>${invitation.organizationName}<b></h3>
        <table>
          <tr>
              <td class="info"><b>Direccion:</b></td>
              <td><p>${invitation.invitedEmail}</p></td>
          </tr>
          <tr>
              <td class="info"><b>Link</b></td>
              <td><p><a href="${invitation.uri}">Unirme</a></p></td>
          </tr>
      </table>
      <br>
      <h4><p>Correo generado automáticamente por <b>Centinela</b> - Tu Bug Tracker favorito</p></h4>
    </body>
  </html>`
}
