require('dotenv').config()
module.exports = class MailerService {
  constructor() {}

  static newBugEmail(bug, email) {
    let emailObject = {
      address: email
      , subject: 'Bug asignado'
      , bodyText: newBugBodyText(bug)
      , bodyHTML: newBugBodyHTML(bug)
    }
    return emailObject
  }

  static newReportEmail(bugs, email) {
    let emailObject = {
      address: email
      , subject: `Reporte diario de Bugs asignados de severidad ${bugs[0].severity}`
      , bodyText: 'un texto'
      , bodyHTML: newReportEmailBodyHtml(bugs)
    }
    return emailObject
  }
  static newOldBugsReportEmail(bugs, email, numberOfDays) {
    let emailObject = {
      address: email
      , subject: `Tienes bugs asignados sin resolver por más de ${numberOfDays} días`
      , bodyText: 'un texto'
      , bodyHTML: newOldBugsReportEmailBodyHtml(bugs, numberOfDays)
    }
    return emailObject
  }
}

newBugBodyText = (bug) => {
  `Se te a asignado un bug
   Titulo: ${bug.title}
   Descripcion: ${bug.description}
   Correo generado automáticamente por Centinela - Tu Bug Tracker favorito`
}

newBugBodyHTML = (bug) => {
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

      tr.border_bottom td {
            border-bottom: 1px solid black;
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
  <title>Nuevo Bug</title>
  </head>
  <body>
  
  <h1>Se te ha asignado un Bug</h1>
  <table>
      <tr>
          <td class="values"><b>Titulo:</b></td>
          <td>${bug.title}</td>
      </tr>
      <tr>
          <td class="info"><b>Descripcion:</b></td>
          <td><p>${bug.description}</p></td>
      </tr>
      <tr>
          <td class="info"><b>Link</b></td>
          <td><a href="${process.env.FRONT_END_MAIN_URL}/bug/${bug.id}">Ir</a></td>
      </tr>
  </table>
  <br>
  <h4><p>Correo generado automáticamente por <b>Centinela</b> - Tu Bug Tracker favorito</p></h4>
  </body>
  </html>`
}

createRowsForReportBody = (bugs) => {
  var rows = ''
  bugs.forEach(element => {
    rows +=
      `<tr class="border_bottom">
    <td class="values">${element.id}</td>
    <td class="values">${element.title}</td>
    <td class="values"><p>${element.description}</p></td>
    <td class="values"><a href="${process.env.FRONT_END_MAIN_URL}/bug/${element.id}">Ir</a></td>
</tr>`
  });
  return rows
}

newReportEmailBodyHtml = (bugs) => {
  return `<!DOCTYPE html>
<html>

<head>
<style>
table {
    text-align: left;
    vertical-align: middle;
    max-width: 1000px;
    table-layout: auto;
}

th,
td {
    padding: 10px;
    border-collapse: collapse;
}

.values {
    min-width: 100px;
    max-width: 500px;
}

.info {
    min-width: 100px;
    max-width: 500px;
}
</style>
    <title>Nuevo Bug</title>
</head>

<body>
    <h2>Reporte diario de bugs asignados con severidad ${bugs[0].severity}</h2>
    <table>
        <tr>
            <th class="info">Id</th>
            <th class="info">Titulo</th>
            <th class="info">Descripcion</th>
            <th class="info">Link</th>
        </tr>
${createRowsForReportBody(bugs)}
    </table>
    <br>
    <h4>
        <p>Correo generado automáticamente por <b>Centinela</b> - Tu Bug Tracker favorito</p>
    </h4>
</body>
</html>`
}

newOldBugsReportEmailBodyHtml = (bugs, numberOfDays) => {
  return `<!DOCTYPE html>
<html>

<head>
<style>
table {
    text-align: left;
    vertical-align: middle;
    max-width: 1000px;
    table-layout: auto;
}

th,
td {
    padding: 10px;
    border-collapse: collapse;
}

.values {
    min-width: 100px;
    max-width: 500px;
}

.info {
    min-width: 100px;
    max-width: 500px;
}
</style>
    <title>Nuevo Bug</title>
</head>

<body>
    <h2>Reporte diario de bugs que tienes asignados con más de ${numberOfDays} días sin resolver</h2>
    <table>
        <tr>
            <th class="info">Id</th>
            <th class="info">Titulo</th>
            <th class="info">Descripcion</th>
            <th class="info">Link</th>
        </tr>
${createRowsForReportBody(bugs)}
    </table>
    <br>
    <h4>
        <p>Correo generado automáticamente por <b>Centinela</b> - Tu Bug Tracker favorito</p>
    </h4>
</body>
</html>`
}
