var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
var promise = Promise.resolve(); // or Promise.delay
promise.catch(function(e){
    console.log('error?');
});

//Creating a schema
var ticketSchema = new Schema({ 
    ticketType: String,
    prijs: Number,
    aantalVrij: String,
});



//The Schema is useless, needs a model before using it
var MongooseTickets = mongoose.model('Tickets', ticketSchema);
//Make it accesable for our Node application
module.exports = MongooseTickets;