process.env.NODE_ENV = 'test'
process.env.TS_NODE_PROJECT = "tsconfig.testing.json"

let chai2 = require('chai')
let chaiHttp = require('chai-http')
let app = require('../index.ts')
let should = chai2.should()
let server

chai2.use(chaiHttp)
describe('Test Suite', () => {
  let agent = chai2.request.agent(app)
  before(done => {
    app.on('app_started', done)
    app.use((req, res, next) => {
      if (!server) {
        server = req.connection.server
      }
      next()
    })
  })

  after(done => {
    server.close(done)
  })

  describe("Routes", () => {
    describe("Unauthenticated user", () => {
      /* User routes */

      it('should get 401 from GET /users', (done) => {
        chai2.request('http://localhost:3000')
          .get('/users')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from GET /users/:id', (done) => {
        chai2.request('http://localhost:3000')
          .get('/users/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from POST /users', (done) => {
        chai2.request('http://localhost:3000')
          .post('/users')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from DELETE /users/:id', (done) => {
        chai2.request('http://localhost:3000')
          .delete('/users/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from PATCH /users/:id/permissions/:id', (done) => {
        chai2.request('http://localhost:3000')
          .patch('/users/1/permission/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from DELETE /users/:id/permissions/:id', (done) => {
        chai2.request('http://localhost:3000')
          .delete('/users/1/permission/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from PATCH /users/:id/roles/:id', (done) => {
        chai2.request('http://localhost:3000')
          .patch('/users/1/role/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from DELETE /users/:id/roles/:id', (done) => {
        chai2.request('http://localhost:3000')
          .delete('/users/1/role/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from DELETE /users/:id/session', (done) => {
        chai2.request('http://localhost:3000')
          .delete('/users/1/session')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      /* Role routes */

      it('should get 401 from GET /roles', (done) => {
        chai2.request('http://localhost:3000')
          .get('/roles')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from GET /roles/:id', (done) => {
        chai2.request('http://localhost:3000')
          .get('/roles/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from POST /roles', (done) => {
        chai2.request('http://localhost:3000')
          .post('/roles')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from DELETE /roles/:id', (done) => {
        chai2.request('http://localhost:3000')
          .delete('/roles/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from PATCH /roles/:id/permission:id', (done) => {
        chai2.request('http://localhost:3000')
          .patch('/roles/1/permission/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from DELETE /roles/:id/permission:id', (done) => {
        chai2.request('http://localhost:3000')
          .delete('/roles/1/permission/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      /* Permission routes */

      it('should get 401 from GET /permissions', (done) => {
        chai2.request('http://localhost:3000')
          .get('/permissions')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from GET /permissions/:id', (done) => {
        chai2.request('http://localhost:3000')
          .get('/permissions/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from POST /permissions', (done) => {
        chai2.request('http://localhost:3000')
          .post('/permissions')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from DELETE /permissions/:id', (done) => {
        chai2.request('http://localhost:3000')
          .delete('/permissions/1')
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      /* Auth routes */

      it('should get 401 from POST /login with wrong email', (done) => {
        chai2.request('http://localhost:3000')
          .post('/login')
          .send({
            email: "admin@task.com2",
            password: "admin"
          })
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 401 from POST /login with wrong password', (done) => {
        chai2.request('http://localhost:3000')
          .post('/login')
          .send({
            email: "admin@task.com",
            password: "admin2"
          })
          .end((error, response) => {
            response.should.have.status(401)
            done()
          })
      })

      it('should get 200 from POST /login with correct credentials', (done) => {
        chai2.request('http://localhost:3000')
          .post('/login')
          .send({
            email: "admin@task.com",
            password: "admin"
          })
          .end((error, response) => {
            response.should.have.status(200)
            done()
          })
      })

      it('should get 400 from POST /login while already logged in', (done) => {
        agent.post('/login')
          .send({
            email: "admin@task.com",
            password: "admin"
          })
          .then(async (error, response) => {
            const response2 = await agent.post('/login')
              .send({
                email: "admin@task.com",
                password: "admin"
              })
            response2.should.have.status(400)
            done()
          })
      })

      it('should get 400 from POST /logout if not logged in', (done) => {
        chai2.request('http://localhost:3000')
          .post('/logout')
          .end((error, response) => {
            response.should.have.status(400)
            done()
          })
      })

      agent = chai2.request.agent(app)
      it('should get 200 from POST /logout while logged in', (done) => {
        agent.post('/login')
          .send({
            email: "admin@task.com",
            password: "admin"
          })
          .then(async (error, response) => {
            const response2 = await agent.post('/logout')
            response2.should.have.status(200)
            done()
          })
      })
    })

    describe("Authenticated user", () => {
      agent = chai2.request.agent(app)
      it('should get 200 from GET /users with permission', (done) => {
        agent.post('/login')
          .send({
            email: "admin@task.com",
            password: "admin"
          })
          .then(async (error, response) => {
            const response2 = await agent.get('/users')
            response2.should.have.status(200)
            response2.body.should.be.a('array')
            done()
          })
      })

      it('should get 200 from GET /users/:id with permission', (done) => {
        agent.post('/login')
          .send({
            email: "admin@task.com",
            password: "admin"
          })
          .then(async (error, response) => {
            const response2 = await agent.get('/users/1')
            response2.should.have.status(200)
            response2.body.should.be.a('object')
            response2.body.should.have.property('name')
            response2.body.should.have.property('email')
            done()
          })
      })

      it('should get 200 from GET /roles with permission', (done) => {
        agent.post('/login')
          .send({
            email: "admin@task.com",
            password: "admin"
          })
          .then(async (error, response) => {
            const response2 = await agent.get('/roles')
            response2.should.have.status(200)
            response2.body.should.be.a('array')
            done()
          })
      })

      it('should get 200 from GET /roles/:id with permission', (done) => {
        agent.post('/login')
          .send({
            email: "admin@task.com",
            password: "admin"
          })
          .then(async (error, response) => {
            const response2 = await agent.get('/roles/1')
            response2.should.have.status(200)
            response2.body.should.be.a('object')
            response2.body.should.have.property('name')
            done()
          })
      })

      it('should get 200 from GET /permissions with permission', (done) => {
        agent.post('/login')
          .send({
            email: "admin@task.com",
            password: "admin"
          })
          .then(async (error, response) => {
            const response2 = await agent.get('/permissions')
            response2.should.have.status(200)
            response2.body.should.be.a('array')
            done()
          })
      })

      it('should get 200 from GET /permissions/:id with permission', (done) => {
        agent.post('/login')
          .send({
            email: "admin@task.com",
            password: "admin"
          })
          .then(async (error, response) => {
            const response2 = await agent.get('/permissions/1')
            response2.should.have.status(200)
            response2.body.should.be.a('object')
            response2.body.should.have.property('name')
            done()
          })
      })

      it('should get 400 from POST /register with invalid email', (done) => {
        chai2.request('http://localhost:3000')
          .post('/register')
          .send({
            name: "Tester",
            email: "tester_email",
            password: "tester123"
          })
          .end((error, response) => {
            response.should.have.status(400)
            response.body.should.be.a('object')
            response.body.should.have.property('error')
            done()
          })
      })

      it('should get 400 from POST /register with invalid password', (done) => {
        chai2.request('http://localhost:3000')
          .post('/register')
          .send({
            name: "Tester",
            email: "tester@task.com",
            password: "test"
          })
          .end((error, response) => {
            response.should.have.status(400)
            response.body.should.be.a('object')
            response.body.should.have.property('error')
            done()
          })
      })

      it('should get 400 from POST /register with missing password', (done) => {
        chai2.request('http://localhost:3000')
          .post('/register')
          .send({
            name: "Tester",
            email: "tester@task.com"
          })
          .end((error, response) => {
            response.should.have.status(400)
            response.body.should.be.a('object')
            response.body.should.have.property('error')
            done()
          })
      })

      it('should get 400 from POST /register with missing email', (done) => {
        chai2.request('http://localhost:3000')
          .post('/register')
          .send({
            name: "Tester",
            password: "test"
          })
          .end((error, response) => {
            response.should.have.status(400)
            response.body.should.be.a('object')
            response.body.should.have.property('error')
            done()
          })
      })

      it('should get 400 from POST /register with missing name', (done) => {
        chai2.request('http://localhost:3000')
          .post('/register')
          .send({
            email: "tester@task.com",
            password: "test"
          })
          .end((error, response) => {
            response.should.have.status(400)
            response.body.should.be.a('object')
            response.body.should.have.property('error')
            done()
          })
      })

      it('should get 201 from POST /register with correct data', (done) => {
        chai2.request('http://localhost:3000')
          .post('/register')
          .send({
            name: "Tester",
            email: "tester@task.com",
            password: "tester123"
          })
          .end((error, response) => {
            response.should.have.status(201)
            response.body.should.be.a('object')
            response.body.should.have.property('message')
            done()
          })
      })
    })
  })
})
