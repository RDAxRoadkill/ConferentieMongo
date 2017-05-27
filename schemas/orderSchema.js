var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
var promise = Promise.resolve(); // or Promise.delay

//PDF meems
var PDFDocument = require ('pdfkit');
var fs = require('fs');
var qr = require('qr-image');
var passwordHash = require('password-hash');

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

orderSchema.methods.createPDF = function(sess, ticketsArray, callback){
    var doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('test.pdf'));
    for(var i=0;i <ticketsArray.length; i++){
        if(sess.lunchVrijdag !=0){
            var lunchVrijdag = qr.imageSync(passwordHash.generate(sess.lunchVrijdag + sess.email),{ type: 'png' });
            doc.image(lunchVrijdag, 0, 0, { fit: [205, 205] });
            doc.addPage();
        }
        if(sess.lunchZaterdag !=0){
            var lunchZaterdag = qr.imageSync(passwordHash.generate(sess.lunchZaterdag + sess.email),{ type: 'png' });
            doc.image(lunchZaterdag, 0, 0, { fit: [205, 205] });
            doc.addPage();
        }
        if(sess.dinerZaterdag !=0){
            var dinerZaterdag = qr.imageSync(passwordHash.generate(sess.dinerZaterdag + sess.email),{ type: 'png' });
            doc.image(dinerZaterdag, 0, 0, { fit: [205, 205] });
            doc.addPage();
        }
        if(sess.lunchZondag !=0){
            var lunchZondag = qr.imageSync(passwordHash.generate(sess.lunchZondag + sess.email),{ type: 'png' });
            doc.image(lunchZondag, 0, 0, { fit: [205, 205] });
            doc.addPage();
        }
        if(sess.dinerZondag !=0){
            var dinerZondag = qr.imageSync(passwordHash.generate(sess.dinerZondag + sess.email),{ type: 'png' });
            doc.image(dinerZondag, 0, 0, { fit: [205, 205] });
            doc.addPage();
        }
    }
    doc.end();
    var wow = 1;    
    return callback(null, wow);
}

//The Schema is useless, needs a model before using it
var MongooseOrder = mongoose.model('Order', orderSchema);
//Make it accesable for our Node application
module.exports = MongooseOrder;