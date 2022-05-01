const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, userOneID, setupDatabase} = require('./fixtures/db')

beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request(app).post('/users').send({
        name:'Naveen',
        email:'naveen1798@gmail.com',
        password:'dfghfefdgd'
    }).expect(201)

    // Assert that the databse was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    // Assertions about response
    expect(response.body).toMatchObject({
        user:{
            name:'Naveen',
            email:'naveen1798@gmail.com'
        },
        token:user.tokens[0].token
    })
    expect(user.password).not.toBe('dfghfefdgd')

})

test('Should login existing user', async () => {
   const response = await request(app).post('/users/login').send({
        email:userOne.email,
        password:userOne.password
    }).expect(200)

    // Assert that new token was saved correctlyin database
    const user = await User.findById(userOneID)
    expect(response.body.token).toBe(user.tokens[1].token)
})

test("Should not login nonexistent user", async () => {
    await request(app).post('/users/login').send({
        email:"dummy@example.com",
        password:"dummyPassword"
    }).expect(400)
})

test("Should get Profile for user", async () => {
    await request(app)
          .get('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)
})

test("Should not get profile for unauthenticated user", async () => {
    await request(app)
          .get('/users/me')
          .send()
          .expect(401)
})

test("Should delete account for user", async () => {
    await request(app)
          .delete('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send()
          .expect(200)
    
    const user = await User.findById(userOneID)

    expect(user).toBeNull()

})

test("Should not delete account for unauthenticated user", async () => {
    await request(app)
          .get('/users/me')
          .send()
          .expect(401)
})

test("Should upload avatar image", async () => {
    await request(app)
          .post('/users/me/avatar')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .attach('avatar', 'tests/fixtures/profile-pic.jpg')
          .expect(200)
    
    const user = await User.findById(userOneID)

    expect(user.avatar).toEqual(expect.any(Buffer))
})

test("Should update valid user fields", async () => {
    await request(app)
          .patch('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send({
              name:'Mike'
          })
          .expect(200)
    const user = await User.findById(userOneID)
    expect(user.name).toEqual('Mike')
})

test("Should not update invalid user fields", async () => {
    await request(app)
          .patch('/users/me')
          .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
          .send({
              location:'dummylocation'
          })
          .expect(400)

})