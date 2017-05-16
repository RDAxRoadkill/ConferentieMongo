var mysql = require('../db.js');

var Tijdslot = function (){
    idSlot = '';
    idSpreker = '';
    onderwerpSlot = '';
    zaalNummer = '';
    beginTijd = '';
    eindTijd = '';
    idSlot = '';
    beginTijd = '';
    eindTijd = '';
    Zaal = '';
    status = '';
};

Tijdslot.getSloten = function(callback){
    var query = "SELECT * FROM `Agenda` INNER JOIN `spreker` ON `Agenda`.`idSpreker` = `spreker`.`idSpreker` ORDER BY `idSlot`";
    mysql.connection(function (err,conn){
        if(err){
            return callback(err);

        }
        conn.query(query, function (err, rows){
            if(err){
                return callback(err);
            } var tijdslot = [];
            
           for (var i = 0; i < rows.length; i++) {
                tijdslot.push({
                    "idSlot": rows[i].idSlot,
                    "idSpreker": rows[i].idSpreker,
                    "onderwerpSlot": rows[i].onderwerpSlot,
                    "zaalNummer" : rows[i].zaalNummer,
                    "beginTijd": rows[i].beginTijd,
                    "eindTijd": rows[i].eindTijd,
                    "onderwerp": rows[i].onderwerp,
                    "wensen": rows[i].wensen,
                    "voorkeurSloten": rows[i].voorkeurSloten,
                    "toegewezenSloten": rows[i].toegewezenSloten,
                    "naam": rows[i].naam,
                    "tussenvoegsel": rows[i].tussenvoegsel,
                    "achternaam": rows[i].achternaam,
                    "email": rows[i].email,
                    "rol": rows[i].rol,
                    "idMaaltijd": rows[i].idMaaltijd,
                });
            } return callback(null, tijdslot);
        })
    })
}

Tijdslot.getSlotsFriday = function(callback){
    var query = "SELECT * FROM `Slot` ORDER BY `idSlot` LIMIT 20";
    mysql.connection(function (err,conn){
        if(err){
            return callback(err);

        }
        conn.query(query, function (err, rows){
            if(err){
                return callback(err);
            } var slot = [];
            
           for (var i = 0; i < rows.length; i++) {
                slot.push({
                    "idSlot": rows[i].idSlot,
                    "beginTijd": rows[i].beginTijd,
                    "eindTijd": rows[i].eindTijd,
                    "Zaal" : rows[i].Zaal,
                    "status": rows[i].status,
                });
            } return callback(null, slot);
        })
    })
}

Tijdslot.getSlotsSaturday = function(callback){
    var query = "SELECT * FROM `Slot` WHERE idSlot >= 21 AND idSlot <= 56 ORDER BY `idSlot`";
    mysql.connection(function (err,conn){
        if(err){
            return callback(err);

        }
        conn.query(query, function (err, rows){
            if(err){
                return callback(err);
            } var slot = [];
            
           for (var i = 0; i < rows.length; i++) {
                slot.push({
                    "idSlot": rows[i].idSlot,
                    "beginTijd": rows[i].beginTijd,
                    "eindTijd": rows[i].eindTijd,
                    "Zaal" : rows[i].Zaal,
                    "status": rows[i].status,
                });
            } return callback(null, slot);
        })
    })
}

Tijdslot.getSlotsSunday = function(callback){
    var query = "SELECT * FROM `Slot` WHERE idSlot >= 57 AND idSlot <= 72 ORDER BY `idSlot`";
    mysql.connection(function (err,conn){
        if(err){
            return callback(err);

        }
        conn.query(query, function (err, rows){
            if(err){
                return callback(err);
            } var slot = [];
            
           for (var i = 0; i < rows.length; i++) {
                slot.push({
                    "idSlot": rows[i].idSlot,
                    "beginTijd": rows[i].beginTijd,
                    "eindTijd": rows[i].eindTijd,
                    "Zaal" : rows[i].Zaal,
                    "status": rows[i].status,
                });
            } return callback(null, slot);
        })
    })
}

module.exports = Tijdslot;
