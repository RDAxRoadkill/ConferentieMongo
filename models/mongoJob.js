var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = require('bluebird');
var promise = Promise.resolve(); // or Promise.delay
var db = mongoose.connection;
var fs = require('fs');
var sendgrid = require("sendgrid")("");

var MongoBackup = function(){}

MongoBackup.createDump = function(obj, callback){
    const execFile = require('child_process').execFile;
    const child = execFile('mongodump', (err, stdout, stderr) => {
      if (err) {
        throw err;
      } else {
        fs.readFile('./dump/test/orders.bson', function(err, data) {
            if(err){
                    console.log(err);
            }
            sendgrid.send({
                    to: 'backup@mail.nl',
                    cc: 'wouter97@planet.nl',
                    from: 'backup@conferentieStorm.nl',
                    subject: 'Backup database',
                    text: 'De backup',
                    files     : [{filename: 'orders.bson', path: './dump/test/orders.bson', content: data, contentType:'application/bson'}, {filename: 'orders.metadata', path: './dump/test/orders.metadata', content: data, contentType:'application/txt'}]
                    }, function(err, json) {
                    if (err) { return console.error(err); }
                          console.log(json);
                    });
             });
          console.log(stdout);
          var dumped = 1;
          return callback(null, dumped);    
      }
    });
}

module.exports = MongoBackup;