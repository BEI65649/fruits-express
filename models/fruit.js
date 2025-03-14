//model/fruits.js

const mongoose = require ('mongoose')// this gives the fruit.js file access to the mongoose file

const fruitSchema = new mongoose.Schema({
    name: String,
    isReadyToEat: Boolean,// is it ripe enough to start eating
})

const Fruit = mongoose.model ('Fruit', fruitSchema) //create model- the first is a string and the second is to follow the schema that was laid out

// models/fruit.js

module.exports = Fruit;//send the fruit variable accessible to other files in the project. we created out module called fruit.
