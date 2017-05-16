var Test = function () {}

var Tijdslot = require('../models/tijdslot.js');

Test.testSloten = function(callback) {
  Tijdslot.getSloten(function (err, result) {
          if (err) {
              console.log(err + "errr");
          return callback(null, "0%");
          } else {
            console.log(result);
            if(result !== undefined){
                var tijdSloten = 1;
               return callback(null, tijdSloten);
            }else{
              return callback(null, "0%");
          }

      }
    });
}

//Bestelling toevoegen
module.exports = Test;