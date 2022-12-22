const express = require('express')
var morgan = require('morgan')
const app = express()
let persons = [
    {
        "id": 1,
        "name": "Arto Hellas",
        "number": "040-123456"
    },
    {
        "id": 2,
        "name": "Ada Lovelace",
        "number": "39-44-5323523"
    },
    {
        "id": 3,
        "name": "Dan Abramov",
        "number": "12-43-234345"
    },
    {
        "id": 4,
        "name": "Mary Poppendieck",
        "number": "39-23-6423122"
    }
]
const getRandomInt = (max = 1000000000) => {
    return Math.floor(Math.random() * max)
}


//便地访问数据，我们需要 express json-parser 的帮助(https://expressjs.com/en/api.html)
app.use(express.json())
morgan.token('body', req => {
    return JSON.stringify(req.body)
})
app.use(express.static('build'))
app.use(morgan('[:date[clf]] :method :url :body'))
app.get('/', (req, res) => {
    res.send('<div>Welcom to phonebook</div>')
})

app.get('/info', (require, response) => {
    const count = persons.length
    const time = new Date()
    response.send(`
    <div> 
    Phonebook has info for ${count} people
    <p>${time}</p>
    </div>
    `)
})
app.get('/api/persons', (require, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (require, response) => {
    const id = Number(require.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
})
app.post('/api/persons', (require, response) => {
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
    // insert or update
    const exitsPerson = persons.find(person => person.name === body.name)
    if (exitsPerson) {
        exitsPerson.number = body.number
        persons = persons.map(person => person.id === exitsPerson.id ? exitsPerson : person)
        response.json(exitsPerson)
        return
    }
    const person = {
        id: getRandomInt(),
        name: body.name,
        number: body.number
    }
    persons = persons.concat(person)
    response.json(person)
})
app.delete('/api/persons/:id', (require, response) => {
    const id = Number(require.params.id)
    persons = persons.filter(person => person.id !== id)
    response.json(204).end()
})

const PORT = 3001
app.listen(PORT, () => {

    console.log(`Server running on port ${PORT}`)
})