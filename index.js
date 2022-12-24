require('dotenv').config()
const express = require('express')
var morgan = require('morgan')
const app = express()
const Person = require('./models/person')
const cors = require('cors')
app.use(cors())

//便地访问数据，我们需要 express json-parser 的帮助(https://expressjs.com/en/api.html)
app.use(express.json())
morgan.token('body', req => {
  return JSON.stringify(req.body)
})
app.use(express.static('build'))
app.use(morgan('[:date[clf]] :method :url :body'))
app.get('/', (res) => {
  res.send('<div>Welcom to phonebook</div>')
})

app.get('/info', (require, response) => {
  Person.countDocuments({}).then(count => {
    console.log(count)

    const time = new Date()
    response.send(`
    <div> 
    Phonebook has info for ${count} people
    <p>${time}</p>
    </div>
    `)
  })
})
app.get('/api/persons', (require, response) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
})
app.get('/api/persons/:id', (require, response, next) => {
  Person.findById(require.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => { next(error) })
})
app.post('/api/persons', (require, response, next) => {
  const body = require.body
  if (!body.name) {
    return response.status(400).json({
      error: 'name must be unique'
    })
  }
  if (!body.number) {
    return response.status(400).json({
      error: 'number must be unique'
    })
  }
  const person = new Person({
    name: body.name,
    number: body.number
  })
  person.save()
    .then(savePerson => {
      response.json(savePerson)
    })
    .catch(error => { next(error) })
})
app.put('/api/persons/update', (require, response, next) => {
  const { name, number } = require.body

  Person.findByIdAndUpdate(require.body.id, { name, number }, { new: true, runValidators: true, context: 'query' })
    .then(updatePerson => {
      response.json(updatePerson)
    })
    .catch(error => { next(error) })
})
app.delete('/api/persons/:id', (require, response, next) => {
  Person.findByIdAndRemove(require.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => { next(error) })
})

const unkonwEndPoint = (request, response) => {
  response.status(404).send({ error: 'unkonw endpoint' })
}
app.use(unkonwEndPoint)

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)
const PORT = 3001
app.listen(PORT, () => {

  console.log(`Server running on port ${PORT}`)
})