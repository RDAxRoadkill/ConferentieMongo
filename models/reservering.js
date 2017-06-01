var mysql = require('../db.js');
var PDFDocument = require ('pdfkit');
var fs = require('fs');
var qr = require('qr-image');
var passwordHash = require('password-hash');

var Reservering = function(){
    ticketID = '';
    hashcode = '';
    QRcode = '';
    idGebruiker = '';
    idMaaltijd = '';
    ticketType = '';
    naam = '';
    tussenvoegsel = '';
    achternaam = '';
    email = '';
    rol = '';
    dagDeel = '';
    prijs = '';
    tijdstip = '';
    aantalvrij = '';
    lunchVrijdag = '';
    lunchZaterdag = '';
    lunchZondag = '';
    dinerZaterdag = '';
    dinerZondag = '';
    totaalAantalTickets = '';
}

Reservering.newMaaltijd = function(obj, callback){
    var query = "INSERT INTO `Maaltijd` VALUES (NULL, ?, ?, ?, ?, ?, ?,?)";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        //Clean the array's of their pesky comma business.
        obj.lunchVrijdag = obj.lunchVrijdag.join("");
        obj.lunchZaterdag = obj.lunchZaterdag.join("");
        obj.dinerZaterdag = obj.dinerZaterdag.join("");
        obj.lunchZondag = obj.lunchZondag.join("");
        obj.dinerZondag = obj.dinerZondag.join("");

        conn.query(query, [obj.ticketID, obj.lunchVrijdag, obj.lunchZaterdag, obj.dinerZaterdag, obj.lunchZondag, obj.dinerZondag, obj.idSpreker], function (err, rows){
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    })
};

Reservering.updateSpreker = function(obj, callback){
    var query = "SELECT idMaaltijd FROM `Maaltijd` WHERE idSpreker = ?";
        mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.idSpreker, obj.idMaaltijd], function (err, rows){
            var idMaaltijd = rows[0].idMaaltijd
            if(err){
                return callback(err, null);
            } else {
                obj.idMaaltijd = idMaaltijd;
                console.log("IDMAALTIJD " +obj.idMaaltijd)
                var query2 = "UPDATE `Spreker` SET idMaaltijd = ? WHERE idSpreker = ?";
                    mysql.connection(function (err, conn){
                        if(err) {
                            return callback(err);
                        }
                        conn.query(query2, [obj.idMaaltijd, obj.idSpreker], function (err, rows){
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
};

Reservering.newTicket = function(obj, callback){
    var query = "INSERT INTO `Tickets` VALUES (?, ?, ?, ?)";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        //Clean the array's of their pesky comma business.
        obj.ticketVrijdag = obj.ticketVrijdag.join("");
        obj.ticketZaterdag = obj.ticketZaterdag.join("");
        obj.ticketZondag = obj.ticketZondag.join("");

        conn.query(query, [obj.ticketID, obj.ticketVrijdag, obj.ticketZaterdag, obj.ticketZondag], function (err, rows){
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    })
};

Reservering.checkFreeTickets = function(obj, callback){
    var query = "SELECT aantalVrij from `Bestellingen` where ticketType = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.ticketType, obj.aantalVrij], function (err, rows) {
            if(obj.ticketType == undefined || obj.ticketType == '') {
                console.log("Undefined, gimme dat errror. ERROR NOG OPLOSSEN");
                var ticketError = 'leeg';
                return callback(null, ticketError)
            }
            console.log("ticketType: " + obj.ticketType);
            var aantalVrij = rows[0].aantalVrij;
            console.log(aantalVrij);
            if (err) {
                console.log("err");
                return callback(err,null);
            }
            if (aantalVrij <= 0 ) {
                console.log("geen tickets meer");
            }
            else{
            var query2 = "set SQL_SAFE_UPDATES = 0; UPDATE `Bestellingen` SET aantalVrij = aantalVrij - ? - ? - ? WHERE ticketType = ?;";
                mysql.connection(function (err, conn) {
                if (err) {
                    return callback(err);
                }
                conn.query(query2, [obj.ticketVrijdag, obj.ticketZaterdag, obj.ticketZondag, obj.ticketType], function (err, rows) {
                                if (err) {
                console.log("err");
                return callback(err,null);
            }
                    else {
                        console.log("Verlaging gelukt");
                        //return callback(null, aantalVrij);
                    }
                    });
                }) 
            }
        });
    })
};
Reservering.getTicketPrice = function(obj, callback){
    var query = "SELECT prijs from `Bestellingen` where ticketType = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.ticketType, obj.prijs], function (err, rows) {
            /* if(obj.ticketType == undefined || obj.ticketType == '') {
                console.log("Undefined, gimme dat errror. ERROR NOG OPLOSSEN");
                var ticketError = 'leeg';
                return callback(null, ticketError)
            } */
            console.log("ticketType: " + obj.ticketType);
            var prijs = rows[0].prijs;
            console.log(prijs);
            if (err) {
                console.log("err");
                return callback(err,null);
            }
            else{
                return callback(null, prijs);
            }
        })
    })
};
                   
Reservering.getTicketID = function(obj, callback){
  var query = "SELECT ticketID from `Bestelling` where email = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.email, obj.ticketID], function (err, rows) {
            console.log("Email: " + obj.email);
            var ticketID = rows[0].ticketID;
            console.log(ticketID);
            if (err) {
                console.log("err");
                return callback(err,null);
            } else{
                return callback(null, ticketID);
            }
        });
    })
}; 
Reservering.calculateTotalTickets = function(obj, callback){
    obj.ticketVrijdag = obj.ticketVrijdag.join("");
    obj.ticketZaterdag = obj.ticketZaterdag.join("");
    obj.ticketZondag = obj.ticketZondag.join("");
    
    var totaalAantalTickets = (1 * obj.ticketVrijdag) + (1 * obj.ticketZaterdag) + (1 * obj.ticketZondag);
    console.log('totale berekening:');
    console.log(totaalAantalTickets);
    console.log(obj.ticketVrijdag);
    console.log(obj.ticketZaterdag);
    console.log(obj.ticketZondag);
    return callback(null, totaalAantalTickets);
}
Reservering.newOrder = function(obj, callback) {
    var query = "INSERT INTO `Bestelling` VALUES(NULL,?,?,?,?,?)";
        mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        }
        conn.query(query, [obj.hashCode, obj.QRCode, obj.ticketType, obj.email, obj.totaalAantalTickets], function (err, rows){
            if(err){
                return callback(err, null);
            } else {
                return callback(null, rows);
            }
        })
    })
};

Reservering.createPDF = function(obj, callback){
    var query = "SELECT * FROM `Bestelling` WHERE `ticketID` = ?";
    mysql.connection(function (err,conn){
        if(err){
            return callback(err);
        }
        conn.query(query, [obj.ticketID], function (err, rows){
            if(err){
                return callback(err);
            } 
            var tijdslot = [];
            var doc = new PDFDocument;
            doc.pipe( fs.createWriteStream('test.pdf') );
            for(var i=0;i<rows.length;i++){
                   doc.text('Uw code voor annuleren' + rows[i].hashCode,{  align: 'right'});
            }
            var query = "SELECT * FROM `Tickets` WHERE `ticketID` = ?";
                mysql.connection(function (err,conn){
                    if(err){
                        return callback(err);
                    }
                    conn.query(query, [obj.ticketID], function (err, rows){
                        if(err){
                            return callback(err);
                    } 
                for(var i=0;i<rows.length;i++){
                    console.log(rows[i].ticketVrijdag);
                    if(rows[i].ticketVrijdag != 0){
                        var ticketVrijdag = qr.imageSync((rows[i].ticketVrijdag + obj.email),{ type: 'png' });
                        doc.image(ticketVrijdag, 0, 0, { fit: [205, 205] });
                        doc.addPage();
                    }
                    console.log(rows[i].ticketZaterdag);
                    if(rows[i].ticketZaterdag != 0){
                        var ticketZaterdag = qr.imageSync((rows[i].ticketZaterdag + obj.email),{ type: 'png' });
                        doc.image(ticketZaterdag, 0, 0, { fit: [205, 205] });
                        doc.addPage();
                    }
                    console.log(rows[i].ticketZondag);
                    if(rows[i].ticketZondag != 0){
                        var ticketZondag = qr.imageSync((rows[i].ticketZondag + obj.email),{ type: 'png' });
                        doc.image(ticketZondag, 0, 0, { fit: [205, 205] });
                        doc.addPage();
                    }
                }
            var query = "SELECT * FROM `Maaltijd` WHERE `ticketID` = ?";
            mysql.connection(function (err,conn){
                if(err){
                    return callback(err);
                }
                conn.query(query, [obj.ticketID], function (err, rows){
                    if(err){
                        return callback(err);
                    }
                for(var i=0;i<rows.length;i++){
                    doc.text('maaltijd'); //verdere in info toevoegen !!
                    if(rows[i].lunchVrijdag != 0){
                        var lunchVrijdag = qr.imageSync((rows[i].lunchVrijdag + obj.email),{ type: 'png' });
                        doc.image(lunchVrijdag, 0, 0, { fit: [205, 205]});
                        doc.addPage();
                    }
                    if(rows[i].lunchZaterdag != 0){
                        var lunchZaterdag = qr.imageSync((rows[i].lunchZaterdag + obj.email),{ type: 'png' });
                        doc.image(lunchZaterdag, 0, 0, { fit: [205, 205]});
                        doc.addPage();
                    }
                    if(rows[i].dinerZaterdag != 0){
                        var dinerZaterdag = qr.imageSync((rows[i].dinerZaterdag + obj.email),{ type: 'png' });
                        doc.image(dinerZaterdag, 0, 0, { fit: [205, 205]});
                        doc.addPage();
                    }
                    if(rows[i].lunchZondag != 0){
                        var lunchZondag = qr.imageSync((rows[i].lunchZondag + obj.email),{ type: 'png' });
                        doc.image(lunchZondag, 0, 0, { fit: [205, 205]});
                        doc.addPage();
                    }
                    if(rows[i].dinerZondag != 0){
                        var dinerZondag = qr.imageSync((rows[i].dinerZondag + obj.email),{ type: 'png' });
                        doc.image(dinerZondag, 0, 0, { fit: [205, 205]});
                    }
                }
                doc.end();
                return callback(null, tijdslot);
                })
            })
        })
    })
   })
  })
}

module.exports = Reservering;