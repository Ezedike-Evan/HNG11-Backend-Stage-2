const bcrypt = require('bcrypt')
const validateUser = require('../middlewares/validateUser')
const generateToken = require('../middlewares/generateToken')
const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()
const saltRounds = 10

const registerUser = async(req,res)=>{
    const { firstName, lastName, email, password, phone } = req.body
    const validationErrors = validateUser.validateUser(req.body)
    if (validationErrors) {
      return res.status(422).json({ 
            errors: validationErrors 
        })
    }
  
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds)
        const newUser = await prisma.user.create({
            data: { 
                firstName, 
                lastName, 
                email, 
                password: hashedPassword, 
                phone 
            }
        })
        const orgName = `${firstName}'s Organisation`
        const newOrg = await prisma.organisation.create({
            data: { 
                name: orgName, 
                description : `This is ${orgName}` ,
                users: { 
                    connect: { 
                        userId: newUser.userId 
                    } 
                }
            }
        })
  
        const token = generateToken.generateToken(newUser)
  
        res.status(201).json({
            status: 'success',
            message: 'Registration successful',
            data: {
                accessToken: token,
                user : newUser
            }
        })
    } catch (error) {
        res.status(400).json({ 
            status: 'Bad request', 
            message: 'Registration unsuccessful', 
            statusCode: 400 
        })
    }
}

const loginUser = async (req,res)=>{
    const { email, password } = req.body
    const user = await prisma.user.findUnique({ where: { email } })
  
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ status: 'Bad request', message: 'Authentication failed', statusCode: 401 })
    }
  
    const token = generateToken.generateToken(user)
    res.status(200).json({
      status: 'success',
      message: 'Login successful',
      data: {
        accessToken: token,
        user: { userId: user.userId, firstName: user.firstName, lastName: user.lastName, email: user.email, phone: user.phone }
      }
    })
}

module.exports = {
    registerUser,
    loginUser
}