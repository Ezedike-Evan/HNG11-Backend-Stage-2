const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const getOrg = async(req,res)=>{
    const userOrgs = await prisma.organisation.findMany({
        where: { 
            users: { 
                some: { 
                    userId: req.user.userId 
                } 
            } 
        }
    })
      res.status(200).json({
        status: 'success',
        message: 'Organisations fetched successfully',
        data: { 
            organisations: userOrgs 
        }
    })
}

const getOrgId = async(req,res)=>{
    const { orgId } = req.params
    const org = await prisma.organisation.findUnique({ 
        where: { 
            orgId 
        } 
    })
    if (!org) 
        return res.status(404).json({ 
            message: 'Organisation not found' 
        })
  
    res.status(200).json({
        status: 'success',
        message: 'Organisation fetched successfully',
        data: { 
            orgId: org.orgId, 
            name: org.name, 
            description: org.description 
        }
    })
}

const postOrg = async(req,res)=>{
    const { name, description } = req.body
    if (!name) 
        return res.status(422).json({ 
            field: 'organisation name', 
            message: 'Organisation Name is required' 
        })
    
    try {
        const newOrg = await prisma.organisation.create({
            data: { 
                name, 
                description, 
                users: { 
                    connect: { 
                        userId: req.user.userId 
                    } 
                } 
            }
        })
      res.status(201).json({
        status: 'success',
        message: 'Organisation created successfully',
        data: { 
            orgId: newOrg.orgId, 
            name: newOrg.name, 
            description: newOrg.description 
        }
      })
    } catch (error) {
      res.status(400).json({ status: 'Bad Request', message: 'Client error', statusCode: 400 })
    }
}

const postOrgUser = async(req,res)=>{
    const { orgId } = req.params
    const { userId } = req.body
  
    try {
        await prisma.organisation.update({
            where: { orgId },
                data: { 
                users: { 
                    connect: { 
                        userId 
                    } 
                } 
            }
        })
        res.status(200).json({ 
            status: 'success', 
            message: 'User added to organisation successfully' 
        })
    } catch (error) {
        res.status(400).json({ 
            status: 'Bad Request', 
            message: 'Client error', 
            statusCode: 400 
        })
    }
}

module.exports = {
    getOrg,
    getOrgId,
    postOrg,
    postOrgUser
}