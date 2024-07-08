// tests/accessControl.spec.js
const canAccessOrganization = require('../services/accessControl')

describe('Organization Access Control', () => {
  it('should allow access if user belongs to the organization', () => {
    const user = { id: 1, organizations: [1, 2, 3] }
    const result = canAccessOrganization.canAccessOrganization(user, 2)
    expect(result).toBe(true)
  });

  it('should deny access if user does not belong to the organization', () => {
    const user = { id: 1, organizations: [1, 2, 3] }
    const result = canAccessOrganization.canAccessOrganization(user, 4)
    expect(result).toBe(false)
  })
})

// tests/auth.spec.ts
import request from 'supertest'
import app from '../server'
import prisma from '../services/prisma'
process.env.DATABASE_URL = 'postgresql://postgres.hvgmapagkloyrmccvbuc:4n2tr5CCjHBFwE@@aws-0-eu-central-1.pooler.supabase.com:6543/postgres'

describe('POST /auth/register', () => {

  it('should register user successfully with default organization', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123',
        phone : '12345265743'
      });

    expect(res.statusCode).toEqual(201)
    expect(res.body.email).toEqual('john.doe@example.com')
    expect(res.body.organization.name).toEqual("John's Organization")
    expect(res.body.token).toBeDefined()
  })

  it('should log the user in successfully', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'Password123',
        phone : '12345265743'
      })

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'jane.doe@example.com',
        password: 'Password123'
      })

    expect(res.statusCode).toEqual(200)
    expect(res.body.email).toEqual('jane.doe@example.com')
    expect(res.body.token).toBeDefined()
  })

  it('should fail if required fields are missing', async () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password']

    for (const field of requiredFields) {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'johndoe@example.com',
        password: 'Password123',
      };
      delete userData[field]

      const res = await request(app)
        .post('/auth/register')
        .send(userData)

      expect(res.statusCode).toEqual(422)
      expect(res.body.errors[0].field).toEqual(field)
      expect(res.body.errors[0].message).toBeDefined()
    }
  })
})