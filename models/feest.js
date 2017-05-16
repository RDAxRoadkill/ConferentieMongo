var mysql = require('../db.js');
var PDFDocument = require ('pdfkit');
var fs = require('fs');
var qr = require('qr-image');
var passwordHash = require('password-hash');
var sendgrid = require("sendgrid")("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");

var Feest = function () {
    email = '';
    maxAantalTickets = '';
    AantalVrij = '';
    emailUser = '';
    //ticketVrij
    //maxAllowedTickets, ophalen based on what?!?! maybe on next screen
};

Feest.getInfo = function(callback){
    var query = "SELECT * FROM `FeestPlaatsen` ORDER BY `id` LIMIT 1";
    mysql.connection(function (err,conn){
        if(err){
            return callback(err);
        }
        conn.query(query, function (err, rows){
            if(err){
                return callback(err);
            } var feest = [];
            
           for (var i = 0; i < rows.length; i++) {
                feest.push({
                    "id": rows[i].id,
                    "AantalVrij": rows[i].AantalVrij,
                });
            } return callback(null, feest);
        })
    })
};

Feest.newUitnodiging = function(obj, callback){
    var query = "INSERT INTO `FeestUitnodiging` VALUES(NULL,?,?)";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.ticketZaterdag], function (err, rows) {
            console.log(obj.email);
            console.log(obj.ticketZaterdag);
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })
};

Feest.addOrder = function(obj, callback){
    var query = "INSERT INTO `BestellingFeest` VALUES(NULL,?,?,?)";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.aantalTickets, obj.email, obj.gekozenSector], function (err, rows) {
            console.log(obj.email);
            console.log(obj.gekozenSector);
            console.log(obj.aantalTickets);
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })
};

Feest.controlInvite = function(obj, callback) {
    var query = "SELECT email as emailUser from `FeestUitnodiging` WHERE email = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.emailUser], function (err, rows) {
            console.log(obj.email);
            var emailUser = rows[0].emailUser;
            
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, emailUser);
            }
        });
    })
};

Feest.getMaxTickets = function(obj, callback) {
    var query = "SELECT * from `FeestUitnodiging` WHERE email = ? ORDER BY `id` LIMIT 1";
    mysql.connection(function (err,conn){
        if(err){
            return callback(err);

        }
        conn.query(query, [obj.email], function (err, rows) {
            if (err) {
                console.log(err);
            }
            var feest = [];

            for (var i = 0; i < rows.length; i++) {
                feest.push({
                    "maxAantalTickets": rows[i].maxAantalTickets,
                });
            }
            return callback(null, feest);
        })
    })
};
                
Feest.update  = function(obj, callback){
    var query = "SELECT AantalVrij FROM `FeestPlaatsen`";
        mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.AantalVrij], function (err, rows){
            var oldAantal = rows[0].AantalVrij
            if(err){
                return callback(err, null);
            } else {
                obj.AantalVrij = oldAantal - obj.aantalTickets;
                console.log(obj.AantalVrij);
                if(obj.AantalVrij < 0){
                    var vol = 'vol';
                    return callback(null, vol);
                }
                var query2 = "UPDATE `FeestPlaatsen` SET AantalVrij = ? WHERE id = 1";
                    mysql.connection(function (err, conn){
                        if(err) {
                            return callback(err);
                        } 
                       conn.query(query2, [obj.AantalVrij], function (err, rows){
                            if(err){
                                return callback(err, null);
                            } else {
                            var query3 = "DELETE FROM `FeestUitnodiging` WHERE email = ?";
                                mysql.connection(function (err, conn){
                                    if(err) {
                                        return callback(err);
                                    }
                                    conn.query(query3, [obj.email], function (err, rows){
                                        if(err){
                                            return callback(err, null);
                                        } else {
                                            return callback(null, rows);
                                        }
                                    })
                                })
                            }
                        }) 
                    })
                }
            })
        })
};

Feest.sendAdminMail = function(obj, callback){
    var query = "SELECT email,gekozenSector FROM `BestellingFeest`";
        mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.adminText], function (err, rows){
            console.log(obj.adminText);
            if(err){
                return callback(err, null);
            } else {
                var feest = [];
            
            for (var i = 0; i < rows.length; i++) {
                sendgrid.send({
                  to: rows[i].email,
                  cc: 'wouter97@planet.nl',
                  from: 'info@conferentieStorm.nl',
                  subject: 'Gebruiker Lijst Netwerken',
                  text:
                    obj.adminText + 
                    rows[i].email + ' ' +
                    rows[i].gekozenSector,
                  }, function(err, json) {
                  if (err) { return console.error(err); }
                  console.log(json);
                });
            } return callback(null, feest);
            }
        })
    })
}

module.exports = Feest;