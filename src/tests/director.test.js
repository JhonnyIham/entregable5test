const request = require('supertest')
const app = require('../app')

const URL_BASE = '/api/v1/directors'
const director = {
    firstName: "Steven",
    lastName: "Spielberg",
    nationality: "USA",
    image: "text random",
    birthday: "1946-12-18"
}

let directorId

test("POST -> URL_BASE, should return status code 201, res.body.firstName === director.firstName", async () => {
    const res = await request(app)
        .post(URL_BASE)
        .send(director)
    
    directorId = res.body.id
    
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(director.firstName)
})

test("GET -> URL_BASE, should return status code 200, and res.body.length === 1", async () =>{
    const res = await request(app)
        .get(URL_BASE)
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("GET -> URL_BASE/:id, should return status code 200, and res.body.firstName === director.firstName", async () => {
    const res = await request(app)
        .get(`${URL_BASE}/${directorId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(director.firstName)
})

test("PUT -> URL_BASE/:id, should return status code 200, res.body.firstName === bodyUpdate.firstName", async () => {
    
    const bodyUpdate = {
        firstName: "David"
    } 

    const res = await request(app)
        .put(`${URL_BASE}/${directorId}`)
        .send(bodyUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.firstName).toBe(bodyUpdate.firstName)
})

test("DELETE -> URL_BASE/:id, should return status code 204", async () => {
    const res = await request(app)
        .delete(`${URL_BASE}/${directorId}`)

    expect(res.statusCode).toBe(204)
})