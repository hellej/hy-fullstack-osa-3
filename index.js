
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')



// const logger = (request, response, next) => {
//    console.log('Method:',request.method)
//    console.log('Path:  ', request.path)
//    console.log('Body:  ', request.body)
//    console.log('---')
//    next()
// }
// app.use(logger)

morgan.token('resdata', function (req, res) {
   return JSON.stringify(req.body)
})


app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :resdata :status :res[content-length] - :response-time ms'))


let persons = [
   {
      "name": "Arto Hellas",
      "number": "040-123456",
      "id": 1
   },
   {
      "name": "Martti Tienari",
      "number": "040-123456",
      "id": 2
   },
   {
      "name": "Arto Järvinen",
      "number": "040-123456",
      "id": 3
   },
   {
      "name": "Lea Kutvonen",
      "number": "040-123456",
      "id": 4
   }
]



app.get('/info', (request, response) => {
   response.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot </p>
   <p> ${new Date()} </p>`)
})

app.get('/api', (request, response) => {
   response.send('<h1>Hello World!</h1>')
})

app.get('/api/persons', (requestreq, response) => {
   response.json(persons)
})

app.get('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   const person = persons.find(person => person.id === id)

   if (person) {
      response.json(person)
   } else {
      response.status(404).end()
   }
})

app.delete('/api/persons/:id', (request, response) => {
   const id = Number(request.params.id)
   persons = persons.filter(person => person.id !== id)

   response.status(204).end()
})

app.post('/api/persons', (request, response) => {
   const person = request.body
   const name = person.name
   person.id = Math.floor(Math.random() * 10000)

   const existingperson = persons.find(person => person.name === name)
   if (existingperson) {
      response.status(400).json({ error: 'Name already in list' })
   } else if (person.name === '' || person.number === '') {
      response.status(400).json({ error: 'Name or number missing' })
   } else {
      response.json(person)
   }
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
   console.log(`Server running on port ${PORT}`)
})

const error = (request, response) => {
   response.status(404).send({ error: 'unknown endpoint' })
}
app.use(error)