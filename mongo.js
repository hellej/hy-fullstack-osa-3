
const mongoose = require('mongoose')

//  // ÄLÄ VIE SALASANAA GITHUBIIN
const url = 'mongodb://joose:SALASANA@ds227858.mlab.com:27858/hy-fullstack-phonebook'

mongoose.connect(url)

const Person = mongoose.model('Person', {
  name: String,
  number: String
})


const person = new Person({
  name: process.argv[2],
  number: process.argv[3]
})


if (person.name) {
  console.log('Lisätään henkilö ', person.name, ' numero ', person.number, ' luetteloon')
  person
    .save()
    .then(response => {
      console.log('person saved!')
      mongoose.connection.close()
    })
  return
}

console.log('Puhelinluettelo: ')
Person
  .find({})
  .then(result => {
    result.forEach(person => {
      console.log(person.name, ' ', person.number)
    })
    mongoose.connection.close()
  })