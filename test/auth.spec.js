// tests/tokenService.spec.js
const jwt = require('jsonwebtoken')
const generateToken = require('../middlewares/generateToken')

describe('Token Generation', () => {
  it('should generate a token with correct user details and expiration', () => {
    const user = { id: 1, email: 'test@example.com', name: 'Test User' }
    const token = generateToken(user)
    const decoded = jwt.verify(token, process.env.JWT_SECRET)

    expect(decoded.id).toBe(user.id)
    expect(decoded.email).toBe(user.email)
    expect(decoded.name).toBe(user.name)
    expect(decoded.exp).toBeDefined()
  })
})

// tests/accessControl.spec.js
const canAccessOrganization = require('../services/accessControl');

describe('Organization Access Control', () => {
  it('should allow access if user belongs to the organization', () => {
    const user = { id: 1, organizations: [1, 2, 3] }
    const result = canAccessOrganization(user, 2)
    expect(result).toBe(true)
  });

  it('should deny access if user does not belong to the organization', () => {
    const user = { id: 1, organizations: [1, 2, 3] }
    const result = canAccessOrganization(user, 4)
    expect(result).toBe(false)
  })
})

// tests/auth.spec.ts
import request from 'supertest'
import app from '../server'
import prisma from '../prisma'

describe('POST /auth/register', () => {
  beforeAll(async () => {
    // Clean up database before tests
    await prisma.user.deleteMany({})
  })

  it('should register user successfully with default organization', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toEqual(201)
    expect(res.body.user.email).toEqual('john.doe@example.com')
    expect(res.body.user.organization.name).toEqual("John's Organization")
    expect(res.body.token).toBeDefined()
  })

  it('should log the user in successfully', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Jane',
        lastName: 'Doe',
        email: 'jane.doe@example.com',
        password: 'Password123'
      })

    const res = await request(app)
      .post('/auth/login')
      .send({
        email: 'jane.doe@example.com',
        password: 'Password123'
      })

    expect(res.statusCode).toEqual(200)
    expect(res.body.user.email).toEqual('jane.doe@example.com')
    expect(res.body.token).toBeDefined()
  })

  it('should fail if required fields are missing', async () => {
    const requiredFields = ['firstName', 'lastName', 'email', 'password']

    for (const field of requiredFields) {
      const userData = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        password: 'Password123'
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

  it('should fail if there is a duplicate email', async () => {
    await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Sam',
        lastName: 'Smith',
        email: 'sam.smith@example.com',
        password: 'Password123'
      });

    const res = await request(app)
      .post('/auth/register')
      .send({
        firstName: 'Samuel',
        lastName: 'Smith',
        email: 'sam.smith@example.com',
        password: 'Password123'
      });

    expect(res.statusCode).toEqual(422)
    expect(res.body.errors[0].field).toEqual('email')
    expect(res.body.errors[0].message).toBeDefined()
  })
})
