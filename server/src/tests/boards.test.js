const request  = require('supertest')
const mongoose = require('mongoose')
const app      = require('../app')
const User     = require('../models/User.model')
const { signToken } = require('../utils/jwt')

let authToken
let userId

beforeAll(async () => {
  const uri = process.env.MONGO_URI_TEST || process.env.MONGO_URI || 'mongodb://localhost:27017/taskflow_test'
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(uri, { dbName: 'taskflow_test' })
  }
  // Create a test user directly (bypass OTP)
  const user = new User({ name:'Board Tester', email:`board_${Date.now()}@test.com`, password:'HashedAlready' })
  user.$skipPasswordHash = true
  await user.save()
  userId    = user._id
  authToken = signToken(user._id)
})

afterAll(async () => {
  await mongoose.connection.dropDatabase()
  await mongoose.connection.close()
})

describe('Boards API', () => {
  let boardId

  it('GET /api/boards — requires auth', async () => {
    const res = await request(app).get('/api/boards')
    expect(res.statusCode).toBe(401)
  })

  it('GET /api/boards — returns empty array for new user', async () => {
    const res = await request(app).get('/api/boards').set('Authorization', `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200)
    expect(res.body.data.boards).toEqual([])
  })

  it('POST /api/boards — creates a board', async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Test Board', description: 'A test', color: '#5B50F8' })
    expect(res.statusCode).toBe(201)
    expect(res.body.data.board.title).toBe('Test Board')
    boardId = res.body.data.board._id
  })

  it('POST /api/boards — rejects missing title', async () => {
    const res = await request(app)
      .post('/api/boards')
      .set('Authorization', `Bearer ${authToken}`)
      .send({ description: 'No title' })
    expect(res.statusCode).toBe(400)
  })

  it('PATCH /api/boards/:id — updates board title', async () => {
    const res = await request(app)
      .patch(`/api/boards/${boardId}`)
      .set('Authorization', `Bearer ${authToken}`)
      .send({ title: 'Updated Board' })
    expect(res.statusCode).toBe(200)
    expect(res.body.data.board.title).toBe('Updated Board')
  })

  it('DELETE /api/boards/:id — deletes board', async () => {
    const res = await request(app)
      .delete(`/api/boards/${boardId}`)
      .set('Authorization', `Bearer ${authToken}`)
    expect(res.statusCode).toBe(200)
  })
})
