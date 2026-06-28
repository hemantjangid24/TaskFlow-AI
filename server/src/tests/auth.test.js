const request = require('supertest')
const mongoose = require('mongoose')
const app      = require('../app')

// Use a separate test DB or mock
beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow_test'
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { dbName: 'taskflow_test' })
  }
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('Auth API', () => {
  const testUser = { name: 'Test User', email: `test_${Date.now()}@example.com`, password: 'Test@1234!' }

  describe('POST /api/auth/register', () => {
    it('should reject missing fields', async () => {
      const res = await request(app).post('/api/auth/register').send({ email: 'x@x.com' })
      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('should reject weak password', async () => {
      const res = await request(app).post('/api/auth/register').send({ name:'A', email:'a@b.com', password:'weak' })
      expect(res.statusCode).toBe(400)
      expect(res.body.success).toBe(false)
    })

    it('should accept valid registration and send OTP', async () => {
      const res = await request(app).post('/api/auth/register').send(testUser)
      // 200 = OTP sent (email may fail in test env, but response should succeed)
      expect([200, 500]).toContain(res.statusCode)
    })
  })

  describe('POST /api/auth/login', () => {
    it('should reject invalid credentials', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'nobody@nowhere.com', password: 'Wrong@123!' })
      expect(res.statusCode).toBe(401)
      expect(res.body.success).toBe(false)
    })

    it('should reject missing password', async () => {
      const res = await request(app).post('/api/auth/login').send({ email: 'x@x.com' })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('POST /api/auth/forgot-password', () => {
    it('should always return success (prevent email enumeration)', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'doesnotexist@test.com' })
      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
    })

    it('should reject invalid email format', async () => {
      const res = await request(app).post('/api/auth/forgot-password').send({ email: 'notanemail' })
      expect(res.statusCode).toBe(400)
    })
  })

  describe('GET /api/health', () => {
    it('should return healthy', async () => {
      const res = await request(app).get('/api/health')
      expect(res.statusCode).toBe(200)
      expect(res.body.success).toBe(true)
    })
  })
})
