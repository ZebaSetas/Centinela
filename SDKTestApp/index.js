const CentinelaBugReporter = require('centinela-bug-reporter');

(async() => {
  console.log("This app will generate a bug to centinela");
  try {
    let result = await CentinelaBugReporter.reportBug('este es el titutlo'
      , 'Esto es una descripcion', CentinelaBugReporter.SEVERITY.HIGH)
  } catch (err) {
    console.log(err);
  }
})()
