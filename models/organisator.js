var mysql = require('../db.js');

var Organisator = function () {
    email = '';
    wachtwoord = '';
    ticketID = '';
    incheckTijd = '';
    aantalGebruikersBinnen = '';
    email = '';
    totaalAantalTickets = '';
};

Organisator.loginUser = function (obj, callback){
    var query ="SELECT count(*) as aantal from `Login` where email = ? and wachtwoord = ?";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.wachtwoord], function (err, rows){
            var aantal = rows[0].aantal;
            console.log(aantal);
            //console.log(callback(null, aantal))
            if(err) {
                return callback(err, null);
            }
            if (aantal == 0){
                return callback(null, aantal);
            }
            if (aantal => 0){
                return callback(null, aantal);
            } else {
                console.log("Else: " +rows[0]);
            }
        })
    });
    
};

Organisator.checkinUser = function(obj, callback){
    var query = "INSERT INTO `activegebruikers` VALUES (?,?,?,?)";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.ticketID, obj.incheckTijd, obj.aantalGebruikers, obj.email ], function (err, rows){
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    });
};

Organisator.getUser = function(obj, callback){
    var query = "SELECT ticketID FROM `Bestelling` where email = ?"; 
     mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.ticketID], function (err, rows) {
            console.log("email: " + obj.email);
            var ticketID = rows[0].ticketID;
            if (err) {
                console.log("err");
                return callback(err,null);
            } else{
                return callback(null, ticketID);
            }
        });
  });
};

Organisator.getAantalGebruikers = function(obj, callback){
    var query = "SELECT totaalAantalTickets FROM `Bestelling` where email = ?"; 
     mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.totaalAantalTickets], function (err, rows) {
            var totaalAantalTickets = rows[0].totaalAantalTickets;
            console.log("gebr " + totaalAantalTickets)
            if (err) {
                console.log("err");
                return callback(err,null);
            } else{
                return callback(null, totaalAantalTickets);
            }
        });
  });
};

Organisator.getGebruikers = function(callback){
    var query = "SELECT * FROM `Activegebruikers` ORDER BY `incheckTijd` ASC;";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, function (err, rows) {
            if (err) {
                return callback(err);
            }
            var gebruikers = [];

            for (var i = 0; i < rows.length; i++) {
                gebruikers.push({
                    "ticketID": rows[i].ticketID,
                    "incheckTijd": rows[i].incheckTijd,
                    "aantalGebruikersBinnen": rows[i].aantalGebruikersBinnen,
                    "email": rows[i].email,
                });
            }
            return callback(null, gebruikers);
        })
    });
};

Organisator.getTickets = function(callback){
    var query = "SELECT * FROM `Bestelling` ORDER BY `ticketID` ASC;";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, function (err, rows) {
            if (err) {
                return callback(err);
            }
            var bestellingen = [];

            for (var i = 0; i < rows.length; i++) {
                bestellingen.push({
                    "ticketID": rows[i].ticketID,
                    "email": rows[i].email,
                    "ticketType": rows[i].ticketType,
                    "totaalAantalTickets": rows[i].totaalAantalTickets,
                });
            }
            return callback(null, bestellingen);
        })
    });
};

//Organisator sloten
Organisator.denyRequest = function(obj, callback){
    var query = "DELETE FROM `Aanvragen` WHERE idSpreker = ?";
    mysql.connection(function (err, conn){
        if(err){
            return callback(err);
        }
        conn.query(query, [obj.idSpreker], function (err, rows){
            if(err) {
                //return callback(null, err);
                console.log(err);
            }
            else {
                return callback(null, rows)
            }
        })
    })
}

Organisator.allowRequest = function(obj, callback){
    var query = "INSERT INTO `Agenda` VALUES(?,?,?,?,?,?)";
    mysql.connection(function (err, conn){
        if(err){
            return callback(err);
        }
        conn.query(query, [obj.idSlot, obj.idSpreker, obj.onderwerpSlot, obj.zaalNummer,obj.beginTijd,obj.eindTijd ], function (err, rows){
            if(err) {
                //return callback(null, err);
                console.log(err);
            }
            else {
                return callback(null, rows)
            }
        })
    })
}

Organisator.takeSlot = function(obj, callback){
    var query = "UPDATE `Slot` SET `Status`='Bezet' WHERE idSlot = ?";
    mysql.connection(function (err, conn){
        if(err){
            return callback(err);
        }
        conn.query(query, [obj.idSlot], function (err, rows){
            if(err) {
                //return callback(null, err);
                console.log(err);
            }
            else {
                return callback(null, rows)
            }
        })
    })
}
module.exports = Organisator;