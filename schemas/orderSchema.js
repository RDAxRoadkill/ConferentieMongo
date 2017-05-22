var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
var promise = Promise.resolve(); // or Promise.delay
promise.catch(function(e){
    console.log('error?');
});
mongoose.connect('mongodb://localhost/test');
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log('Connected to Mongo');
});

//Creating a schema
var orderSchema = new Schema({ 
    ticketID: Number,
    hashCode: String,
    QRCode:   String,
    ticketType: String,
    email: String,
    totaalAantalTickets: String,
    maaltijd: [{
        idMaaltijd: Number,
        lunchVrijdag: Number,
        lunchZaterdag: Number,
        lunchZondag: Number,
        dinerZaterdag: Number,
        dinerZondag: Number
    }],
    tickets: [{
       idTicket: Number,
       ticketVrijdag: Number,
       ticketZaterdag: Number,
       ticketZondag: Number,
    }],
});

//The Schema is useless, needs a model before using it
var MongooseOrder = mongoose.model('Order', orderSchema);
//Make it accesable for our Node application
module.exports = MongooseOrder;