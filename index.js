
const express = require('express')
const app = express()
var bodyParser = require('body-parser')
var morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

// const logger = (request, response, next) => {
//    console.log('Method:',request.method)
//    console.log('Path:  ', request.path)
//    console.log('Body:  ', request.body)
//    console.log('---')
//    next()
// }
// app.use(logger)

// morgan.token('resdata', function (req, res) {
//    return JSON.stringify(req.body)
// })

morgan.token('resdata', function (req) {
  return JSON.stringify(req.body)
})


app.use(express.static('build'))
app.use(cors())
app.use(bodyParser.json())
app.use(morgan(':method :url :resdata :status :res[content-length] - :response-time ms'))


// const formatPerson = (person) => {
//    return {
//       name: person.name,
//       number: person.number,
//       id: person._id
//    }
// }


// let persons = [
//   {
//     'name': 'Arto Hellas',
//     'number': '040-123456',
//     'id': 1
//   },
//   {
//     'name': 'Martti Tienari',
//     'number': '040-123456',
//     'id': 2
//   }
// ]


app.get('/api/info', (request, response) => {
  Person
    .find({})
    .then(persons => {
      console.log('Length: ', persons.length)
      response.send(`<p>Puhelinluettelossa on ${persons.length} henkilön tiedot </p>
         <p> ${new Date()} </p>`)
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: error })
    })
})


app.get('/api', (request, response) => {
  response.send('<h1>Hello World!</h1>')
})


app.get('/api/persons', (requestreq, response) => {
  Person
    .find({})
    .then(persons => {
      response.json(persons.map(Person.format))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: error })
    })
})


app.get('/api/persons/:id', (request, response) => {
  Person
    .findById(request.params.id)
    .then(Person.format)
    .then(foundperson => {
      if (foundperson) {
        response.json(foundperson)
      } else { response.status(404).send({ error: 'no person found' }) }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})


app.put('/api/persons/:id', (request, response) => {
  const person = {
    name: request.body.name,
    number: request.body.number
  }
  Person
    .findByIdAndUpdate(request.params.id, person, { new: true })
    .then(Person.format)
    .then(updatedperson => {
      response.json((updatedperson))
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: error })
    })
})


app.delete('/api/persons/:id', (request, response) => {
  Person
    .findByIdAndRemove(request.params.id)
    .then(deleted => {
      console.log('Deleted: ', deleted)
      response.status(204).end()
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' })
    })
})


app.post('/api/persons', (request, response) => {
  Person
    .findOne({ name: request.body.name })
    .then(existingperson => {
      if (existingperson) {
        console.log('Person exists: ', existingperson)
        response.status(404).send({ error: 'Name already exists in phonebook' })
      } else {
        console.log('Person doesn not exist')
        const person = new Person({
          name: request.body.name,
          number: request.body.number
        })
        person
          .save()
          .then(Person.format)
          .then(savedperson => {
            console.log('Person saved')
            response.json(savedperson)
          })
          .catch(error => {
            console.log(error)
            response.status(400).send({ error: error })
          })
      }
    })
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: error })
    })
})


const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

const error = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)