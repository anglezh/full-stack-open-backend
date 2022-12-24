const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

mongoose.connect(url)
  .then(() => {
    console.log('connected to MongooDB')
  })
  .catch(error => {
    console.log('error connecting to MongooDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },
  number: {
    validate: {
      validator: function (v) {
        return /^\d{2,3}-\d{7,8}/.test(v)
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    type: String,
    require: true
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)
