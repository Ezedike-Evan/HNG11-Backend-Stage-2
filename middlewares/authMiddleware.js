const jwt = require('jsonwebtoken')

const authMiddleware = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1]
    if (!token) 
      return res.status(401).json({ 
        message: 'Unauthorized' 
      })
  
    jwt.verify(token, 'your_jwt_secret', (err, user) => {
      if (err) 
        return res.status(403).json({ 
          message: 'Forbidden' 
        })
      req.user = user
      next()
    })
  }

  module.exports = {
    authMiddleware
  }