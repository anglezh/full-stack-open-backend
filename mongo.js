const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node mongo.js <password>')
  process.exit(1)
}

const password = process.argv[2]
const name = process.argv[3]
const number = process.argv[4]
console.log(password)
const url =
  `mongodb+srv://songhuajiang:${password}@cluster0.ol7iydr.mongodb.net/Phonebook?retryWrites=true&w=majority`
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
  name: `${name}`,
  number: `${number}`
})
// person.save().then(result => {
//     console.log(`added ${name} number ${number} to phonebook`)
//     mongoose.connection.close()
// })
// Person.find({}).then(result => {
//     result.forEach(note => {
//         console.log(note)
//     })
//     mongoose.connection.close()
// })
person.find({}).then(result => {
  console.log(result)
  mongoose.connection.close()
})