async function testGet() {

  const axios = require('axios')
  const interceptors = require('./axios-interceptors')

  var token =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InVzZXIiOnsibmFtZSI6IkxldGkgbGEgdW5vIiwiZW1haWwiOiJpYW1hZW1haWxAZW1haWwuY29tIiwiaWQiOjEsInJvbGUiOiJBZG1pbiJ9LCJvcmdhbml6YXRpb25JZCI6MX0sImV4cCI6MTAwMDAwMDAxNjA1NDkxNzQwLCJpYXQiOjE2MDU0OTE3NDR9.X_ANysGZfeTKElsr9O49SkHfxNNiy5WdOjVK31zSkrM"

  console.log(`test`);
  axios.interceptors.request.use(interceptors.addTransactionID)
  try {
    let response = await axios.get(
      "http://localhost:5000/api/v1/authorization/validate", {
        headers: {
          authorization: token
        }
      })
    console.log(response)
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  testGet
}
