const jwt = require('jsonwebtoken')

const generateToken = (user) => {
    return jwt.sign({ userId: user.userId, email: user.email }, 'your_jwt_secret', { expiresIn: '1h' })
}
  
module.exports = {
    generateToken
}