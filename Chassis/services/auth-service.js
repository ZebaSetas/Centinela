const TokenVerificationService = require('./tokenVerification-service')

validateUser = (roles) => {
  return async(req, res, next) => {
    const token = req.headers['authorization']
    if (token) {
      try {
        let result = await TokenVerificationService.verifyToken(token)
        let userRole = result.data.user.role
        let validUser = false
        roles.map((r, i) => {
          if (r === userRole) {
            validUser = true
          }
        })
        if (validUser) {
          req.userData = result.data
          next()
        } else {
          return res.status(401).json({
            error: 'You are not authorized to perform this action'
          })
        }
      } catch (err) {
        return res.status(401).json({
          error: 'Invalid authorization Token'
          , trace: err.message
        })
      }
    } else {
      res.status(401).json({
        error: 'Missing required authorization Token'
      })
    }
  }
}

module.exports = {
  validateUser
}
