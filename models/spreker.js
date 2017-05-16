var mysql = require('../db.js');

var Spreker = function(){
    onderwerp = '';
    wensen = '';
    voorkeurSloten = '';
    toegewezenSloten = '';
    naam = '';
    tussenvoegsel = '';
    achternaam = '';
    email = '';
    rol = '';
    idMaaltijd = '';
    status = '';
    id = '';
}

Spreker.newSpreker = function(obj, callback) {
    var query = "INSERT INTO `Spreker` VALUES(NULL,?,?,?,?,?,?,?,?,?,?)";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.onderwerp, obj.wensen, obj.voorkeurSloten, obj.toegewezenSloten, obj.naam, obj.tussenvoegsel, obj.achternaam, obj.email, obj.rol, obj.idMaaltijd], function (err, rows) {
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })
};

Spreker.getID = function(obj, callback){
    var query = "SELECT idSpreker from `Spreker` WHERE email = ?";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        } 
        conn.query(query, [obj.email, obj.idSpreker], function (err, rows){
            var idSpreker = rows[0].idSpreker;
            if(err){ 
                    return callback(err, null);
            } else {
                return callback(null, idSpreker)
            }
        })
    })
};

Spreker.getAanvragen = function(callback){
    var query = "SELECT * FROM `Aanvragen` ORDER BY `datum` ASC;";
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
                    "idSlot": rows[i].idSlot,
                    "idSpreker": rows[i].idSpreker,
                    "onderwerpSlot": rows[i].onderwerpSlot,
                    "zaalNummer": rows[i].zaalNummer,
                    "beginTijd": rows[i].beginTijd,
                    "eindTijd": rows[i].eindTijd,
                    "keuzeType": rows[i].keuzeType,
                    "datum": rows[i].datum,
                    
                });
            }
            return callback(null, gebruikers);
        })
    });
};
Spreker.getAanvraag = function(obj, callback){
    var query = "SELECT * FROM `Aanvragen` WHERE idSpreker = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.idSpreker], function (err, rows){
            if(err){ 
                    return callback(err, null);
            } else {
                return callback(null, rows)
            }
        })
    });
};

Spreker.aanvraagPlaatsen  = function(obj, callback) {
    var query = "INSERT INTO `Aanvragen` VALUES(?,?,?,?,?,?,?,?,?,?,?)";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.idSlot, obj.idSpreker, obj.onderwerpSlot, obj.zaalNummer, obj.beginTijd, obj.eindTijd, obj.keuzeType, obj.datum, obj.naam, obj.tussenvoegsel, obj.achternaam ], function (err, rows) {
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })
};

Spreker.getSlotStatus = function(obj, callback){
    var query = "SELECT status from `Slot` WHERE idSlot = ?";
    mysql.connection(function (err, conn){
        if(err) {
            return callback(err);
        } 
        conn.query(query, [obj.idSlot, obj.status], function (err, rows){
            var status = rows[0].status;
            if(err){ 
                    return callback(err, null);
            } else {
                return callback(null, status)
            }
        })
    })
};

Spreker.occupySlot = function(obj, callback){
    var query = "UPDATE `Slot` SET `Status`='Onder voorbehoud' WHERE idSlot = ?";
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
};

Spreker.addTag = function(obj, callback) {
    var query = "INSERT INTO `Tags` VALUES(NULL,?)";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.naamTag], function (err, rows) {
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })
};

Spreker.selectTag = function(obj, callback) {
    var query = "SELECT id from `Tags` WHERE naamTag = ?";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.naamTag, obj.id], function (err, rows) {
            var idTag = rows[0].id;
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, idTag);
            }
        });
    })
};

Spreker.insertTagAanvraag  = function(obj, callback) {
    var query = "INSERT INTO `AanvraagTags` VALUES(?,?)";
    mysql.connection(function (err, conn) {
        if (err) {
            return callback(err);
        }
        conn.query(query, [obj.idSpreker, obj.idTag], function (err, rows) {
            console.log(obj.idSpreker);
            console.log(obj.idTag);
            if (err) {
                return callback(err,null);
            } else{
                return callback(null, rows);
            }
        });
    })
}; 

module.exports = Spreker;