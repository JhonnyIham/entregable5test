require('../models')

const request = require('supertest')
const app = require('../app')
const Actor = require('../models/Actor')
const Director = require('../models/Director')
const Genre = require('../models/Genre')

const URL_BASE = '/api/v1/movies'
const movie = {
    name: "Soy Leyenda",
    image: "text random",
    synopsis: "Robert Neville, un brillante científico, es el único sobreviviente de una plaga creada por el hombre que transforma a los humanos en mutantes sedientos de sangre. Él vaga solitario por Nueva York, buscando a posibles sobrevivientes, y trabaja para hallar una cura para la plaga usando su propia sangre inmune. Neville sabe que las posibilidades son mínimas, y todos esperan que cometa un error para que él caiga en sus manos",
    releaseYear: "2008-01-03"
}

let movieId

test("POST -> URL_BASE, should return status code 201, res.body.name === movie.name", async () => {
    const res = await request(app)
        .post(URL_BASE)
        .send(movie)
    
    movieId = res.body.id
    
    expect(res.statusCode).toBe(201)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(movie.name)
})

test("GET -> URL_BASE, should return status code 200, and res.body.length === 1", async () =>{
    const res = await request(app)
        .get(URL_BASE)
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
})

test("GET -> URL_BASE/:id, should return status code 200, and res.body.name === movie.name", async () => {
    const res = await request(app)
        .get(`${URL_BASE}/${movieId}`)
    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(movie.name)
})

test("PUT -> URL_BASE/:id, should return status code 200, res.body.name === bodyUpdate.name", async () => {
    
    const bodyUpdate = {
        name: "Hombres de negro"
    } 

    const res = await request(app)
        .put(`${URL_BASE}/${movieId}`)
        .send(bodyUpdate)

    expect(res.statusCode).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body.name).toBe(bodyUpdate.name)
})

test("Post -> URL_BASE/:id/actors, should return statusCode 200 and res.body.length === 1 ", async () => {

    const createActor = await Actor.create({
        firstName: "Sam",
        lastName: "Worthington",
        nationality: "USA",
        image: "text random",
        birthday: "1976-08-02"
    })
  
    const res = await request(app)
      .post(`${URL_BASE}/${movieId}/actors`)
      .send([createActor.id])
  
    console.log(res.body);
    
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].moviesActors.movieId).toBe(movieId)
    expect(res.body[0].moviesActors.actorId).toBe(createActor.id)
   
    await createActor.destroy()
})

test("Post -> URL_BASE/:id/directors, should return statusCode 200 and res.body.length === 1 ", async () => {

    const createDirector = await Director.create({
        firstName: "David",
        lastName: "Fincher",
        nationality: "USA",
        image: "text random",
        birthday: "1962-08-28"
    })
  
    const res = await request(app)
      .post(`${URL_BASE}/${movieId}/directors`)
      .send([createDirector.id])
  
    console.log(res.body);
    
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].moviesDirectors.movieId).toBe(movieId)
    expect(res.body[0].moviesDirectors.directorId).toBe(createDirector.id)
   
    await createDirector.destroy()
})

test("Post -> URL_BASE/:id/genres, should return statusCode 200 and res.body.length === 1 ", async () => {

    const createGenre = await Genre.create({ name: "suspense" })
  
    const res = await request(app)
      .post(`${URL_BASE}/${movieId}/genres`)
      .send([createGenre.id])
  
    console.log(res.body);
    
    expect(res.status).toBe(200)
    expect(res.body).toBeDefined()
    expect(res.body).toHaveLength(1)
    expect(res.body[0].moviesGenres.movieId).toBe(movieId)
    expect(res.body[0].moviesGenres.genreId).toBe(createGenre.id)
   
    await createGenre.destroy()
})

test("DELETE -> URL_BASE/:id, should return status code 204", async () => {
    const res = await request(app)
        .delete(`${URL_BASE}/${movieId}`)

    expect(res.statusCode).toBe(204)
})