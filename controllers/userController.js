const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getUser = async(req,res)=>{
    const { id } = req.params
    const user = await prisma.user.findUnique({ 
        where: { 
            userId: id 
        } 
    })
    if (!user) return res.status(404).json({ 
        message: 'User not found' 
    })
  
    res.status(200).json({
        status: 'success',
        message: 'User fetched successfully',
        data: { 
            userId: user.userId, 
            firstName: user.firstName, 
            lastName: user.lastName, 
            email: user.email, 
            phone: user.phone 
        }
    })
}

module.exports = {
    getUser
}