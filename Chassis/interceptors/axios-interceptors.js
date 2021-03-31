var httpContext = require('express-http-context');

addTransactionID = req => {
  var trasactionId = httpContext.get('Transaction-ID')
  if (trasactionId) {
    req.headers['Transaction-ID'] = trasactionId;
  }
  return req;
}

addAuthorization = req => {
  var token = httpContext.get('Authorization')
  if (token) {
    req.headers.Authorization = token;
  }
  return req;
}

module.exports = {
  addTransactionID
  , addAuthorization
}
