var express = require('express');
var path = require('path');
var router = express.Router();
var sess;
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

//Includes
var passwordHash = require('password-hash');
var Annuleren = require('./models/annuleren.js');
var Tijdslot = require('./models/tijdslot.js');
var Spreker = require('./models/spreker.js');
var Reservering = require('./models/reservering.js');
var Organisator = require('./models/organisator.js');
var Feest = require('./models/feest.js');
var Order = require('./models/order.js');
var Test = require('./models/newTest.js');

//Mongo Includes
var OrderSchema = require('./schemas/orderSchema.js');
var OrderMongo = require('./models/mongoOrder.js');
var OrderTickets = require('./schemas/orderTickets.js');
var MongoBackup = require('./models/mongoJob.js');

//QR-Stuff
var qr = require('qr-image');
var fs = require('fs');
var _ = require('underscore');
var moment = require('moment');
var PDFDocument = require('pdfkit');
//Sendgird key is not shown for safety reasons
var sendgrid = require("sendgrid")("");
moment().format();

//Index
router.get('/', function (req, res) {
    res.render('partials/home.html.twig');
});
router.get('/cronJob', function (req, res) {
    var Order = require('./cronJob.js');
    res.render('partials/home.html.twig');
});
//InfoPagina's (Nog vullen & aanmaken)
router.get('/aboutConference', function (req, res) {
    res.render('partials/textInfo/aboutConference.html.twig');
});
router.get('/aboutOrganizer', function (req, res) {
    res.render('partials/textInfo/aboutOrganizer.html.twig');
});
router.get('/venue', function (req, res) {
    res.render('partials/textInfo/venue.html.twig');
});
router.get('/prevConference', function (req, res) {
    res.render('partials/textInfo/prevConference.html.twig');
});
//Non-function Routes
router.get('/contact', function (req, res) {
    res.render('partials/contact.html.twig');
});
router.get('/tickets', function (req, res) {
    res.render('partials/tickets.html.twig');
});
router.get('/inschrijvenSpreker', function (req, res) {
    res.render('partials/spreker.html.twig');
});
router.get('/tijdslot', function (req, res) {
    res.render('partials/tijdslot.html.twig');
});
router.get('/annuleerReservering', function (req, res) {
    res.render('partials/ticketAnnuleren.html.twig');
});
router.get('/login', function (req, res) {
    res.render('partials/login.html.twig');
});
router.get('/inchecken', function (req, res) {
    res.render('partials/incheck.html.twig');
});
router.get('/extraKeuze', function (req, res) {
    res.render('partials/extraKeuze.html.twig');
});
router.get('/reservering', function (req, res) {
    res.render('partials/reservering.html.twig');
});
router.get('/feestMail', function (req, res) {
    res.render('partials/feestMail.html.twig');
});
//Agenda
router.get('/agenda', function (req, res) { //geen klant
    console.log("Agenda geactiveerd");
    Tijdslot.getSloten(function (err, items2) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            res.render('partials/agenda.html.twig', {tijdslot_items: items2});
        }
    })
});
//Tickets
//Reservering plaatsen
router.post('/newReservering', function (req, res) {
    var code = qr.image(passwordHash.generate(req.body.email + req.body.ticketType), {type: 'png'});
    var output = fs.createWriteStream('memes.png');
    var code2 = qr.image(passwordHash.generate(req.body.lunchVrijdag + req.body.email), {type: 'png'});
    var output2 = fs.createWriteStream('maaltijd.png');
    code.pipe(output);
    code2.pipe(output2);
    var ticketVrijdag = req.body.ticketZondag.join("");
    var ticketZaterdag = req.body.ticketZondag.join("");
    var ticketZondag = req.body.ticketZondag.join("");
    var totaalAantalTickets = ''
    var post = {
        email: req.body.email,
        ticketType: req.body.ticketType,
        //ticketID: req.body.ticketID,
        hashCode: passwordHash.generate(req.body.email + req.body.ticketType),
        QRCode: 'QR.png',
        lunchVrijdag: req.body.lunchVrijdag,
        lunchZaterdag: req.body.lunchZaterdag,
        lunchZondag: req.body.lunchZondag,
        dinerZaterdag: req.body.dinerZaterdag,
        dinerZondag: req.body.dinerZondag,
        ticketVrijdag: req.body.ticketVrijdag,
        ticketZaterdag: req.body.ticketZaterdag,
        ticketZondag: req.body.ticketZondag,
        totaalAantalTickets: totaalAantalTickets
    };
    console.log(post);
    if (post.ticketType == 'null') {
        res.render('partials/error/betalingError.html.twig');
    } else {
        Reservering.calculateTotalTickets(post, function (err, callback) {
            if (err) {
                console.log(err);
                res.render('partials/error/betalingError.html.twig');
            } else {
                post.totaalAantalTickets = callback
                console.log(post.totaalAantalTickets);
                Reservering.newOrder(post, function (err, callback) {
                    if (err) {
                        console.log(err);
                        res.render('partials/error/betalingError.html.twig');
                    } else {
                        console.log("Ticket toegevoegd");
                        Reservering.getTicketID(post, function (err, callback) {
                            if (err) {
                                console.log(err);
                                res.render('partials/error/betalingError.html.twig');
                            } else {
                                console.log("ticketID: " + callback);
                                //session list
                                sess = req.session;
                                sess.ticketID = callback;
                                sess.hashCode = passwordHash.generate(req.body.email + req.body.ticketType);
                                sess.ticketType = req.body.ticketType;
                                sess.ticketVrijdag = req.body.ticketVrijdag;
                                sess.ticketZaterdag = req.body.ticketZaterdag;
                                sess.ticketZondag = req.body.ticketZondag;
                                sess.maaltijdType = req.body.maaltijdType;
                                sess.lunchVrijdag = req.body.lunchVrijdag;
                                sess.lunchZaterdag = req.body.lunchZaterdag;
                                sess.lunchZondag = req.body.lunchZondag;
                                sess.dinerZaterdag = req.body.dinerZaterdag;
                                sess.dinerZondag = req.body.dinerZondag;
                                sess.email = req.body.email;

                                var post = {
                                    email: sess.email,
                                    ticketID: sess.ticketID,
                                    maaltijdType: req.body.maaltijdType,
                                    ticketType: req.body.ticketType,
                                    aantalvrij: '',
                                    lunchVrijdag: req.body.lunchVrijdag,
                                    lunchZaterdag: req.body.lunchZaterdag,
                                    lunchZondag: req.body.lunchZondag,
                                    dinerZaterdag: req.body.dinerZaterdag,
                                    dinerZondag: req.body.dinerZondag,
                                    //Ticket time
                                    ticketVrijdag: req.body.ticketVrijdag,
                                    ticketZaterdag: req.body.ticketZaterdag,
                                    ticketZondag: req.body.ticketZondag,
                                };
                                console.log(sess.ticketID);
                                Reservering.newMaaltijd(post, function (err, callback) {
                                    if (err) {
                                        console.log(err);
                                        res.render('partials/error/betalingError.html.twig');
                                    } else {
                                        console.log("Maaltijd order toegevoegd");
                                        Reservering.newTicket(post, function (err, callback) {
                                            if (err) {
                                                console.log(err);
                                                res.render('partials/error/betalingError.html.twig');
                                            } else {
                                                console.log("Ticket order toegevoegd");
                                                res.redirect('/betalen');
                                                /* Reservering.checkFreeTickets(post, function(err, callback){
                                                 if(err) {
                                                 console.log(err);
                                                 //redirect toevoegen naar error
                                                 }
                                                 if(callback == 'leeg'){
                                                 console.log("Niks ingevuld");
                                                 }
                                                 else {
                                                 var session = post.ticketID
                                                 console.log("Tickets gechecked " + callback);
                                                 res.redirect('/betalen');
                                                 }
                                                 }) */
                                            }
                                        })
                                    }
                                })
                            }
                        })
                    }
                })
            }
        })
    }
});


//Betaling bevestigen
router.get('/betalen', function (req, res) {
    console.log("Prijs Berekening");
    var post = {
        email: sess.email,
        ticketType: sess.ticketType,
        maaltijdType: sess.maaltijdType,
        ticketVrijdag: sess.ticketVrijdag,
        ticketZaterdag: sess.ticketZaterdag,
        ticketZondag: sess.ticketZondag,
        lunchVrijdag: sess.lunchVrijdag,
        lunchZaterdag: sess.lunchZaterdag,
        dinerZaterdag: sess.dinerZaterdag,
        lunchZondag: sess.lunchZondag,
        dinerZondag: sess.dinerZondag,
        hashCode: sess.hashCode
    }
    //Clean the array's of their pesky comma business.
    post.ticketVrijdag = post.ticketVrijdag.join("");
    post.ticketZaterdag = post.ticketZaterdag.join("");
    post.ticketZondag = post.ticketZondag.join("");
    post.lunchVrijdag = post.lunchVrijdag.join("");
    post.lunchZaterdag = post.lunchZaterdag.join("");
    post.dinerZaterdag = post.dinerZaterdag.join("");
    post.lunchZondag = post.lunchZondag.join("");
    post.dinerZondag = post.dinerZondag.join("");

    Reservering.getTicketPrice(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/betalingError.html.twig');
        } else {
            console.log("prijs opgehaald " + callback);
            var priceTicket = callback;
            console.log(post.lunchZaterdag);
            if (post.lunchVrijdag != 0 || post.lunchZaterdag != 0 || post.lunchZondag != 0) {
                var lunch = 1;
            } else {
                var lunch = 0;
            }
            if (post.dinerZaterdag != 0 || post.dinerZondag != 0) {
                var diner = 1;
            } else {
                var diner = 0
            }
            //Ticket
            var calculation = priceTicket * post.ticketVrijdag;
            var calculation2 = priceTicket * post.ticketZaterdag;
            var calculation3 = priceTicket * post.ticketZondag;
            var solution = calculation + calculation2 + calculation3;

            console.log(calculation);
            console.log(calculation2);
            console.log(calculation3);
            console.log(solution);

            //verdere calculaties en solution toevoegen
            if (lunch == 1) {
                var lunchCalculation = 20 * post.lunchVrijdag;
                var lunchCalculation2 = 20 * post.lunchZaterdag;
                var lunchCalculation3 = 20 * post.lunchZondag;
                var lunchSolution = lunchCalculation + lunchCalculation2 + lunchCalculation3;
            }
            if (diner == 1) {
                var dinerCalculation = 30 * post.dinerZaterdag;
                var dinerCalculation2 = 30 * post.dinerZondag;
                var dinerSolution = dinerCalculation + dinerCalculation2;
            }
            var foodSolution = dinerSolution + lunchSolution;
            var completePrice = foodSolution + solution;
            console.log(completePrice);
            res.render('partials/betalen.html.twig', {
                solution: solution,
                priceTicket: priceTicket,
                ticketVrijdag: post.ticketVrijdag,
                ticketZaterdag: post.ticketZaterdag,
                ticketZondag: post.ticketZondag,
                foodSolution: foodSolution,
                completePrice: completePrice,
            });
        }
    })
});
router.post('/confirmOrder', function (req, res) {
//Mailing-shizzay    
    console.log("Order bevestigd");
    var post = {
        email: sess.email,
        ticketID: '',
        hashCode: sess.hashCode,
        ticketZaterdag: sess.ticketZaterdag
    }
    console.log(post.ticketZaterdag);
    post.ticketZaterdag = post.ticketZaterdag.join("");
    console.log(post.ticketZaterdag);
    if (post.ticketZaterdag >= 1) {
        console.log("Zaterdag keuze gemaakt!");
        Feest.newUitnodiging(post, function (err, callback) {
            if (err) {
                console.log(err);
            } else {
                console.log("Uitnodiging toegevoegd");
                sendgrid.send({
                    to: sess.email,
                    cc: 'wouter97@planet.nl',
                    from: 'info@conferentieStorm.nl',
                    subject: 'Netwerkbijeenkomst uitnodiging',
                    text: 'Bedankt voor uw bestelling, Er zijn netwerkbijeenkomsten op zaterdagavond, bent u geintresseerd ga dan naar: http://localhost:8000/feest',
                }, function (err, json) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(json);
                });
            }
        });
    }

    Reservering.getTicketID(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            var post = {ticketID: callback}
            console.log("Start PDF");
            Reservering.createPDF(post, function (err, items2) {
                if (err) {
                    console.log(err);
                    res.render('partials/error/standaardError.html.twig');
                } else {
                    setTimeout(function () {
                        fs.readFile('./test.pdf', function (err, data) {
                            if (err) {
                                console.log(err);
                                res.render('partials/error/standaardError.html.twig');
                            }
                            console.log(data);
                            sendgrid.send({
                                to: sess.email,
                                cc: 'wouter97@planet.nl',
                                from: 'info@conferentieStorm.nl',
                                subject: 'Uw conferentie tickets',
                                files: [{
                                    filename: 'test.pdf',
                                    content: new Buffer(data.toString('base64'), 'base64'),
                                    contentType: 'application/pdf'
                                }],
                                html: 'Bedankt voor uw bestelling, hierbij uw tickets!'
                            }, function (err, json) {
                                if (err) {
                                    console.log(path.resolve(process.cwd(), 'out.pdf'));
                                    return console.error(err);
                                }
                                console.log(json);
                            });
                            res.render('partials/sucess/betalingGelukt.html.twig');
                        });
                    }, 3000);
                }
            })
        }
    })
    res.render('partials/sucess/betalingGelukt.html.twig');
});
//Reservering annuleren
router.post('/cancelReservering', function (req, res) {
    var post = {
        email: req.body.email,
        hashCode: req.body.hashCode,
        QRCode: 'QR',
    };

    console.log("CANCEL");
    console.log(post);
    Annuleren.zoekOrder(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            console.log("ticketID: " + callback);
            sess = req.session;
            sess.ticketID = callback;
            var post = {ticketID: sess.ticketID};
            Annuleren.verwijderOrder(post, function (err, callback) {
                if (err) {
                    console.log(err);
                    res.render('partials/error/standaardError.html.twig');
                } else {
                    console.log("Order destroy >.<");
                    res.render('partials/sucess/annuleerSucess.html.twig');
                }
            })
        }
    })
});

//Feest
router.get('/feest', function (req, res) {
    Feest.getInfo(function (err, items) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            res.render('partials/feestOrder.html.twig', {feest_items: items});
        }
    })
});

router.post('/controleerUitnodiging', function (req, res) {
    var post = {
        email: req.body.email,
        sectorType: req.body.sectorType,
    };
    console.log(post);
    Feest.controlInvite(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        }
        else {
            sess = req.session;
            sess.emailFeest = post.email;
            sess.sectorType = post.sectorType;
            res.redirect('/feestTickets');
        }
    })
});

router.get('/feestTickets', function (req, res) {
    var post = {
        email: sess.emailFeest,
        sectorType: sess.sectorType,
    };
    console.log(sess.emailFeest);
    doc = new PDFDocument;
    doc.pipe(fs.createWriteStream('feest.pdf'));
    doc.text('Bedankt voor uw reservering', {align: 'right'});
    var imageFeest = qr.imageSync((sess.emailFeest), {type: 'png'});
    doc.image(imageFeest, 0, 0, {fit: [205, 205]});
    doc.end();
    Feest.getMaxTickets(post, function (err, items) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            Feest.getMaxTickets(post, function (err, items) {
                if (err) {
                    console.log(err);
                    res.render('partials/error/standaardError.html.twig');
                } else {
                    res.render('partials/feestTickets.html.twig', {feest_items: items});
                }
            })
        }
    })
});
router.post('/confirmParty', function (req, res) {
    var post = {
        email: sess.emailFeest,
        gekozenSector: sess.sectorType,
        aantalTickets: req.body.aantalTickets,
    };
    console.log(post);
    Feest.addOrder(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        }
        else {
            Feest.update(post, function (err, callback) {
                if (err) {
                    console.log(err);
                    res.render('partials/error/standaardError.html.twig');
                }
                if (callback == 'vol') {
                    res.render('partials/error/feestVol.html.twig');
                }
                else {
                    fs.readFile('feest.pdf', function (err, data) {
                        sendgrid.send({
                            to: sess.emailFeest,
                            cc: 'wouter97@planet.nl',
                            from: 'info@conferentieStorm.nl',
                            subject: 'Uw netwerk tickets',
                            text: 'Bedankt voor uw bestelling, hierbij uw ticket!',
                            files: [{
                                filename: 'feest.pdf',
                                path: 'feest.pdf',
                                content: data,
                                contentType: 'application/pdf'
                            }],
                        }, function (err, json) {
                            if (err) {
                                return console.error(err);
                            }
                            console.log(json);
                        });
                    });
                    res.render('partials/sucess/betalingGelukt.html.twig');
                }
            })
        }
    })
});
router.post('/sendFeestmail', function (req, res) {
    var post = {
        adminText: req.body.adminText
    }
    console.log(post);
    Feest.sendAdminMail(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        }
        else {
            sess = req.session;
            sess.mailingList = callback;
            console.log(sess.mailingList);
            sendgrid.send({
                to: sess.mailingList,
                cc: 'wouter97@planet.nl',
                from: 'info@conferentieStorm.nl',
                subject: 'Gebruiker Lijst Netwerken',
                text: post.adminText,
            }, function (err, json) {
                if (err) {
                    return console.error(err);
                }
                console.log(json);
            });
        }
    })


});
//Spreker
router.post('/newSpreker', function (req, res) {
    var post = {
        //idSpreker: null,
        onderwerp: req.body.onderwerp,
        wensen: req.body.wensen,
        voorkeurSloten: 'slot',
        toegewezenSloten: 'slot',
        rol: 'Spreker',
        maaltijdType: req.body.maaltijdType,
        naam: req.body.naam,
        tussenvoegsel: req.body.tussenvoegsel,
        achternaam: req.body.achternaam,
        email: req.body.email,
        maaltijdType: req.body.maaltijdType,
        lunchVrijdag: req.body.lunchVrijdag,
        lunchZaterdag: req.body.lunchZaterdag,
        lunchZondag: req.body.lunchZondag,
        dinerZaterdag: req.body.dinerZaterdag,
        dinerZondag: req.body.dinerZondag,
    };
    console.log(post);
    Spreker.newSpreker(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        }
        else {
            Spreker.getID(post, function (err, callback) {
                if (err) {
                    console.log(err);
                    res.render('partials/error/standaardError.html.twig');
                } else {
                    sess = req.session;
                    sess.idSpreker = callback;
                    sess.onderwerp = req.body.onderwerp;
                    sess.naamTag = req.body.tags;
                    sess.naam = req.body.naam;
                    sess.tussenvoegsel = req.body.tussenvoegsel;
                    sess.achternaam = req.body.achternaam;
                    console.log("Maaltijd toegevoegd");
                    var post = {
                        idSpreker: sess.idSpreker,
                        onderwerp: sess.onderwerp,
                        wensen: req.body.wensen,
                        voorkeurSloten: 'geen',
                        toegewezenSloten: 'geen',
                        rol: 'Spreker',
                        maaltijdType: req.body.maaltijdType,
                        naam: req.body.naam,
                        tussenvoegsel: req.body.tussenvoegsel,
                        achternaam: req.body.achternaam,
                        email: req.body.email,
                        maaltijdType: req.body.maaltijdType,
                        lunchVrijdag: req.body.lunchVrijdag,
                        lunchZaterdag: req.body.lunchZaterdag,
                        lunchZondag: req.body.lunchZondag,
                        dinerZaterdag: req.body.dinerZaterdag,
                        dinerZondag: req.body.dinerZondag,
                        naamTag: sess.naamTag
                    }
                    console.log(post);
                    Reservering.newMaaltijd(post, function (err, callback) {
                        if (err) {
                            console.log(err);
                            res.render('partials/error/standaardError.html.twig');
                        } else {
                            Reservering.updateSpreker(post, function (err, callback) {
                                if (err) {
                                    console.log(err);
                                    res.render('partials/error/standaardError.html.twig');
                                } else {
                                    if (post.maaltijdType == 'maaltijdVrijdag') {
                                        sess = req.session;
                                        sess.dag = 'Vrijdag';
                                        res.redirect('/tijdslotVrijdag');
                                    }
                                    if (post.maaltijdType == 'maaltijdZaterdag') {
                                        sess = req.session;
                                        sess.dag = 'Zaterdag';
                                        res.redirect('/tijdslotZaterdag');
                                    }
                                    if (post.maaltijdType == 'maaltijdZondag') {
                                        sess = req.session;
                                        sess.dag = 'Zondag';
                                        res.redirect('/tijdslotZondag');
                                    }
                                }
                            })
                        }
                    })

                }
            })
        }
    });
});
//Ophalen sloten
router.get('/tijdslotVrijdag', function (req, res) {
    Tijdslot.getSlotsFriday(function (err, items2) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            res.render('partials/tijdslotVrijdag.html.twig', {slot_items: items2});
        }
    })
});
router.get('/tijdslotZaterdag', function (req, res) {
    Tijdslot.getSlotsSaturday(function (err, items2) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            res.render('partials/tijdslotZaterdag.html.twig', {slot_items: items2});
        }
    })
});
router.get('/tijdslotZondag', function (req, res) {
    Tijdslot.getSlotsSunday(function (err, items2) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            res.render('partials/tijdslotZondag.html.twig', {slot_items: items2});
        }
    })
});
router.post('/slotKeuze', function (req, res) {
    console.log("Keuze doorgegeven");
    var post = {
        idSpreker: sess.idSpreker,
        idSlot: req.body.idSlot,
        onderwerpSlot: sess.onderwerp,
        zaalNummer: req.body.zaalnummer,
        beginTijd: req.body.beginTijd,
        eindTijd: req.body.eindTijd,
        keuzeType: req.body.keuzeType,
        datum: new Date(),
        naamTag: sess.naamTag,
        idTag: '',
        naam: sess.naam,
        tussenvoegsel: sess.tussenvoegsel,
        achternaam: sess.achternaam
    }
    console.log(post);
    Spreker.addTag(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            Spreker.getSlotStatus(post, function (err, callback) {
                if (err) {
                    console.log(err);
                    res.render('partials/error/standaardError.html.twig');
                } else {
                    var status = callback;
                    if (status == 'Beschikbaar' || status == 'Onder voorbehoud') {
                        Spreker.occupySlot(post, function (err, callback) {
                            if (err) {
                                console.log(err);
                                res.render('partials/error/standaardError.html.twig');
                            } else {
                                Spreker.aanvraagPlaatsen(post, function (err, callback) {
                                    if (err) {
                                        console.log(err);
                                        res.render('partials/error/standaardError.html.twig');
                                    } else {
                                        console.log("Slot keuze gemaakt");
                                        if (sess.extraKeuze == 1) {
                                            console.log("Tweede keuze al doorgegeven");
                                            res.render('partials/error/sprekerBedankt.html.twig');
                                        } else {
                                            res.redirect('/extraKeuze');
                                        }

                                    }
                                })
                            }
                            if (status == 'Bezet') {
                                console.log('Keuze mag niet, probeer opnieuw');
                                //Bezet scherm
                            }
                        })
                    }
                }
            })
        }
    })
});
router.post('/extraKeuze', function (req, res) {
    var post = {
        idSpreker: sess.idSpreker,
        idSlot: req.body.idSlot,
        onderwerpSlot: sess.onderwerp,
        zaalNummer: req.body.zaalnummer,
        beginTijd: req.body.beginTijd,
        eindTijd: req.body.eindTijd,
        keuzeType: req.body.keuzeType,
        datum: new Date(),
        keuze: req.body.keuze,
        dag: 'Vrijdag',
    }
    sess = req.session;
    sess.extraKeuze = 1;
    if (post.keuze == 'Ja') {
        if (post.dag == 'Vrijdag') {
            res.redirect('/tijdslotVrijdag');
        }
        if (post.dag == 'Zaterdag') {
            res.redirect('/tijdslotZaterdag');
        }
        if (post.dag == 'Zondag') {
            res.redirect('/tijdslotZondag');
        }
    }
    if (post.keuze == 'Nee') {
        console.log("Nee");
        res.render('partials/error/sprekerBedankt.html.twig');
    }
});
//Organisator
//Login
router.post('/loginUser', function (req, res) {
    var post = {
        email: req.body.email,
        wachtwoord: req.body.wachtwoord
    };
    sess = req.session;
    console.log('/login geactiveerd');
    Organisator.loginUser(post, function (err, callback) {
        console.log("Callback: " + callback);
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        }
        if (callback == 0) {
            res.render('partials/errors/errorLogin.html.twig');
        }
        if (callback == 1) {
            console.log("Sessie aanmaken");
            sess.email = req.body.email;
            sess.pwd = req.body.wachtwoord;
            console.log("Gebruikt email " + sess.email + "Gebruikt pwd: " + sess.pwd);
            sess.rol = 'Organisator';
            console.log(sess.rol);
            res.render('partials/backend.html.twig');
            //Link check inbouwen op backend
        }
        if (callback == 0) {
            console.log("Error melding: w8woord of email niet correct");
            //ERROR MELDING INBOUWEN
        }
    })
});
//Tickets
router.get('/ticketOverzicht', function (req, res) {
    console.log("Ophalen tickets");
    Organisator.getTickets(function (err, items) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            res.render('partials/ticketOverzicht.html.twig', {
                bestellingen: items,
            });
        }
    });
});
//Actieve gebruikers
router.get('/bezoekerOverzicht', function (req, res) {
    console.log("Ophalen bezoekers");
    Organisator.getGebruikers(function (err, items) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            res.render('partials/bezoekerOverzicht.html.twig', {
                bezoekers: items,
            });
        }
    });
});
//Inchecken
router.post('/checkinUser', function (req, res) {
    var post = {
        email: req.body.email,
        incheckTijd: new Date(),
        totaalAantalTickets: ''
    }
    Organisator.getUser(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/checkinError.html.twig');
        }
        else {
            console.log("ticketID: " + callback);
            sess = req.session;
            sess.ticketID = callback;
            Organisator.getAantalGebruikers(post, function (err, callback) {
                if (err) {
                    console.log(err);
                    res.render('partials/error/checkinError.html.twig');
                }
                else {
                    console.log("tickets " + callback);
                    sess.totaalAantalTickets = callback;
                    console.log("Aantal gebruikers " + sess.totaalAantalTickets);
                    var post = {
                        email: req.body.email,
                        incheckTijd: new Date(),
                        aantalGebruikers: sess.totaalAantalTickets,
                        ticketID: sess.ticketID
                    }
                    console.log(post);
                    Organisator.checkinUser(post, function (err, callback) {
                        if (err) {
                            console.log(err);
                            res.render('partials/error/checkinError.html.twig');
                        } else {
                            res.render('partials/sucess/checkinSucess.html.twig');
                        }
                    })
                }
            })
        }
    })
});
//Toekennen sloten
router.get('/toekennenSloten', function (req, res) {
    console.log("Ophalen aanvragen");
    Spreker.getAanvragen(function (err, items) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            res.render('partials/toekennen.html.twig', {
                sprekers: items,
            });
        }
    });
});
router.post('/slotToekennen', function (req, res) {
    var post = {
        idSpreker: req.body.idSpreker,
        keuze: req.body.keuze
    }
    if (post.keuze == 'afkeuren') {
        console.log("Aanvraag afgekeurd");
        Organisator.denyRequest(post, function (err, callback) {
            if (err) {
                console.log(err);
                res.render('partials/error/standaardError.html.twig');
            } else {
                console.log("Aanvraag verwijderd");
                sendgrid.send({
                    to: 'wouter97@planet.nl',
                    cc: 'wouterjansen97@gmail.com',
                    from: 'info@conferentieStorm.nl',
                    subject: 'Afwijzing spreek slot',
                    text: 'Bedankt voor uw aanvraag maar uw aanvraag is helaas niet geacepteerd, u kunt eventueel nog een ander slot aanvraag. Onze excuses',
                }, function (err, json) {
                    if (err) {
                        return console.error(err);
                    }
                    console.log(json);
                });
                //deletescherm
            }
        })
    }
    if (post.keuze == 'goedkeuren') {
        console.log("Aanvraag goedgekeurd");
        Spreker.getAanvraag(post, function (err, callback) {
            if (err) {
                console.log(err);
                res.render('partials/error/standaardError.html.twig');
            } else {
                //Variable time
                var idSpreker = callback[0].idSpreker;
                var idSlot = callback[0].idSlot;
                var onderwerpSlot = callback[0].onderwerpSlot;
                var zaalNummer = callback[0].zaalNummer;
                var beginTijd = callback[0].beginTijd;
                var eindTijd = callback[0].eindTijd;
                var naam = callback[0].naam;
                var tussenvoegsel = callback[0].tussenvoegsel;
                var achternaam = callback[0].achternaam;
                sess = req.session;
                sess.dag = '';
                if (idSlot <= 20) {
                    sess.dag = 'Vrijdag';
                }
                if (idSlot >= 20 && idSlot <= 56) {
                    sess.dag = 'Zaterdag';
                }
                if (idSlot >= 56 && idSlot <= 73) {
                    sess.dag = 'Zaterdag';
                }
            }
            var post = {
                idSpreker: idSpreker,
                idSlot: idSlot,
                onderwerpSlot: onderwerpSlot,
                zaalNummer: zaalNummer,
                beginTijd: beginTijd,
                eindTijd: eindTijd,
            }
            console.log(post);
            Organisator.allowRequest(post, function (err, callback) {
                if (err) {
                    console.log(err);
                    res.render('partials/error/standaardError.html.twig');
                } else {
                    Organisator.takeSlot(post, function (err, callback) {
                        if (err) {
                            console.log(err);
                            res.render('partials/error/standaardError.html.twig');
                        } else {
                            console.log("Aanvraag toegevoegd aan agenda");
                            var post = {idSpreker: idSpreker}
                            Organisator.denyRequest(post, function (err, callback) {
                                if (err) {
                                    console.log(err);
                                    res.render('partials/error/standaardError.html.twig');
                                } else {
                                    console.log("Aanvraag verwijderd");
                                    sendgrid.send({
                                        to: 'wouter97@planet.nl',
                                        cc: 'wouterjansen97@gmail.com',
                                        from: 'info@conferentieStorm.nl',
                                        subject: 'Acceptatie spreek slot',
                                        text: 'Bedankt voor uw aanvraag ' + naam + ' ' + tussenvoegsel + ' ' + achternaam + ' U zal spreken vanaf ' + beginTijd + '-' + eindTijd + ' Op de volgende dag: ' + sess.dag + ' tot dan!',
                                    }, function (err, json) {
                                        if (err) {
                                            return console.error(err);
                                        }
                                        console.log(json);
                                    });
                                    //geaccepteerdScherm
                                }
                            })
                        }
                    })
                }
            })
        })
    }
});
//Temp-testing                                    
router.get('/pdf', function (req, res) {
    res.render('partials/pdfTest.html.twig');
});
router.post('/testPDF', function (req, res) {
    var post = {
        hashCode: 'memes',
        email: req.body.email,
        ticketID: 1,
    }
    Reservering.createPDF(post, function (err, items2) {
        if (err) {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        } else {
            setTimeout(function () {
                fs.readFile('./test.pdf', function (err, data) {
                    if (err) {
                        console.log(err);
                        res.render('partials/error/standaardError.html.twig');
                    }
                    console.log(data);
                    sendgrid.send({
                        to: req.body.email,
                        cc: 'wouter97@planet.nl',
                        from: 'info@conferentieStorm.nl',
                        subject: 'Uw conferentie tickets',
                        text: 'Beste ' + req.body.naam + '\n' + 'hier zijn uw tickets in de bijlage.',
                        files: [{
                            filename: 'test.pdf',
                            content: new Buffer(data.toString('base64'), 'base64'),
                            contentType: 'application/pdf'
                        }],
                        html: 'bla bla'
                    }, function (err, json) {
                        if (err) {
                            console.log(path.resolve(process.cwd(), 'out.pdf'));
                            return console.error(err);
                        }
                        console.log(json);
                    });
                    res.render('partials/sucess/betalingGelukt.html.twig');

                });
            }, 3000);
        }
    });
});

router.get('/tests', function (req, res) { 
    console.log("test geactiveerd");
      Test.testSloten(function(err, callback, result){
          if(err){
                 console.log(err);
                  res.render('partials/error/standaardError.html.twig');
             } else {
                 console.log('yay');
                 console.log(callback);
                 var items = {
                     "test1": result,
                 }
                 console.log(items);
                 res.render('partials/testResults.html.twig', {tijdslot_items: items});
             }
         })
  });

//MongoDB Routes
router.get('/mongoOrder', function (req, res) {
    res.render('mongo/tickets.html.twig');
});

//Deze route moet eigenlijk na betaling bevestingen komen
//Eerst vrij checks etc
router.post('/newReserveringMongo', function (req, res) {
    var ticketVrijdag = req.body.ticketVrijdag.join("");
    var ticketZaterdag = req.body.ticketZaterdag.join("");
    var ticketZondag = req.body.ticketZondag.join("");
    var totaalAantalTickets = '';
    var post = {
        ticketType: req.body.ticketType,
        ticketVrijdag: req.body.ticketVrijdag,
        ticketZaterdag: req.body.ticketZaterdag,
        ticketZondag: req.body.ticketZondag,
        totaalAantalTickets: totaalAantalTickets
    }
    console.log(post);
    //Function to add all ticketTypes to one value so we can calculate with it
    Reservering.calculateTotalTickets(post, function (err, callback) {
        if (err) {
            console.log(err);
            res.render('partials/error/betalingError.html.twig');
        } else {
            post.totaalAantalTickets = callback;
            var ticketTypeCheck = post.ticketType;
            var totaalAantalTickets = post.totaalAantalTickets;
            console.log(ticketTypeCheck);
            //By only getting the chosen type, we can safely execute any calculation needed
            OrderTickets.find({ticketType: ticketTypeCheck}, function(err, tickets) {
              if (err) throw err;
              console.log(tickets);
              var databaseAantalVrij = tickets[0].aantalVrij;
                
              if(tickets[0].aantalVrij <= 0) {
                  console.log('Geen tickets meer');
                  res.render('partials/error/optredenVol.html.twig');
              } else {
                  var result = (databaseAantalVrij - totaalAantalTickets);
                  console.log(result);
                  if(result <= 0) {
                      console.log('Aantal tickets zijn niet meer vrij');
                      res.render('partials/error/optredenVol.html.twig');
                  } else {
                      console.log('Tickets mogen eraf gehaald worden.');
                      var updateQuery = {'_id': tickets[0]._id };
                      var newData = {
                          _v: tickets[0]._v,
                          ticketType: ticketTypeCheck,
                          prijs: tickets[0].prijs,
                          aantalVrij: result
                      }
                        sess = req.session;
                        //Session variables
                        sess.id = tickets[0]._id;
                        sess.prijs =  tickets[0].prijs;
                        sess.updateQuery = updateQuery;
                        sess.newData = newData;
                        sess.totaalAantalTickets = totaalAantalTickets;
                        sess.ticketType = req.body.ticketType;
                        sess.ticketVrijdag = req.body.ticketVrijdag.join("");
                        sess.ticketZaterdag = req.body.ticketZaterdag.join("");
                        sess.ticketZondag = req.body.ticketZondag.join("");
                        sess.maaltijdType = req.body.maaltijdType;
                        sess.lunchVrijdag = req.body.lunchVrijdag.join("");
                        sess.lunchZaterdag = req.body.lunchZaterdag.join("");
                        sess.lunchZondag = req.body.lunchZondag.join("");
                        sess.dinerZaterdag = req.body.dinerZaterdag.join("");
                        sess.dinerZondag = req.body.dinerZondag.join("");
                        sess.email = req.body.email;
                        res.redirect('/betalenMongo');
                  }
                  console.log(result);
              }
            });

        }
    });
});

router.get('/betalenMongo', function (req, res){
   console.log('betalen met mongo'); 
    //Dit dus uitbreiden met alle checks & view fixes etc
    //Ze price check
    console.log(sess.prijs);
    var priceTicket = sess.prijs;
    if (sess.lunchVrijdag != 0 || sess.lunchZaterdag != 0 || sess.lunchZondag != 0) {
        var lunch = 1;
    } else {
        var lunch = 0;
    }
    if (sess.dinerZaterdag != 0 || sess.dinerZondag != 0) {
        var diner = 1;
    } else {
        var diner = 0
    }
    console.log(diner);
    console.log(lunch);
    
    //Ticket
    var calculation = priceTicket * sess.ticketVrijdag;
    var calculation2 = priceTicket * sess.ticketZaterdag;
    var calculation3 = priceTicket * sess.ticketZondag;
    var solution = calculation + calculation2 + calculation3;

    console.log(calculation);
    console.log(calculation2);
    console.log(calculation3);
    console.log(solution);
    
    //verdere calculaties en solution toevoegen
    if (lunch == 1) {
        var lunchCalculation = 20 * sess.lunchVrijdag;
        var lunchCalculation2 = 20 * sess.lunchZaterdag;
        var lunchCalculation3 = 20 * sess.lunchZondag;
        var lunchSolution = lunchCalculation + lunchCalculation2 + lunchCalculation3;
    }
    if (diner == 1) {
        var dinerCalculation = 30 * sess.dinerZaterdag;
        var dinerCalculation2 = 30 * sess.dinerZondag;
        var dinerSolution = dinerCalculation + dinerCalculation2;
    }
    if(dinerSolution == undefined){
        var dinerSolution = 0;
    }
    if(lunchSolution == undefined){
        var lunchSolution = 0;
    }
        var foodSolution = dinerSolution + lunchSolution;
        var completePrice = foodSolution + solution;
        console.log(completePrice);
            res.render('mongo/betalen.html.twig', {
                solution: solution,
                priceTicket: priceTicket,
                ticketVrijdag: sess.ticketVrijdag,
                ticketZaterdag: sess.ticketZaterdag,
                ticketZondag: sess.ticketZondag,
                foodSolution: foodSolution,
                completePrice: completePrice,
            });
});

router.post('/confirmOrderMongo', function(req, res){
    var newOrder = new OrderSchema({
        email: sess.email,
        ticketType: sess.ticketType,
        totaalAantalTickets: sess.totaalAantalTickets,
        QRCode: 'QR.png',
        maaltijd: [{
           lunchVrijdag: sess.lunchVrijdag, 
           lunchZaterdag: sess.lunchZaterdag,
           lunchZondag: sess.lunchZondag,
           dinerZaterdag: sess.dinerZaterdag,
           dinerZondag: sess.dinerZondag,
        }],
        tickets: [{
            ticketVrijdag: sess.ticketVrijdag,
            ticketZaterdag: sess.ticketZaterdag,
            ticketZondag: sess.ticketZondag,    
        }],
    });
    var ticketsArray = 
        [{
            ticketVrijdag: sess.ticketVrijdag,
            ticketZaterdag: sess.ticketZaterdag,
            ticketZondag: sess.ticketZondag,    
        }];
    console.log(ticketsArray);
    OrderTickets.findOneAndUpdate(sess.updateQuery, sess.newData, {upsert:false}, function(err, doc){
        if (err) return res.send(500, { error: err });
        newOrder.save();
        console.log('order confirmed');
        //Sendgrid
        console.log(sess.ticketZaterdag);
        if (sess.ticketZaterdag >= 1) {
            console.log("Zaterdag keuze gemaakt!");
            sendgrid.send({
                to: sess.email,
                cc: 'wouter97@planet.nl',
                from: 'info@conferentieStorm.nl',
                subject: 'Netwerkbijeenkomst uitnodiging',
                text: 'Bedankt voor uw bestelling, Er zijn netwerkbijeenkomsten op zaterdagavond, bent u geintresseerd ga dan naar: http://localhost:8000/feest',
            }, function (err, json) {
                if (err) {
                    return console.error(err);
                }
                    console.log(json);
                });
        } 
        newOrder.createPDF(sess, ticketsArray, function (err, callback) {
            if (err) {
                return console.error(err);
            }
            console.log(callback);
            setTimeout(function () {
                fs.readFile('./test.pdf', function (err, data) {
                    if (err) {
                        console.log(err);
                        res.render('partials/error/standaardError.html.twig');
                    }
                    console.log(data);
                    sendgrid.send({
                        to: sess.email,
                        cc: 'wouter97@planet.nl',
                        from: 'info@conferentieStorm.nl',
                        subject: 'Uw conferentie tickets',
                        files: [{
                            filename: 'test.pdf',
                            content: new Buffer(data.toString('base64'), 'base64'),
                            contentType: 'application/pdf'
                        }],
                        html: 'Bedankt voor uw bestelling, hierbij uw tickets!'
                    }, function (err, json) {
                        if (err) {
                                console.log(path.resolve(process.cwd(), 'out.pdf'));
                                return console.error(err);
                        }
                            console.log(json);
                    });
                     res.render('partials/sucess/betalingGelukt.html.twig');
                 });
              }, 3000);
        });    
    });
});

router.get('/backupMongo', function (req, res){ 
    MongoBackup.createDump(sess, function (err, callback){
        if(callback == 1){
            res.render('partials/sucess/backupSuccess.html.twig');   
        } else {
            console.log(err);
            res.render('partials/error/standaardError.html.twig');
        }
       
    });
});

module.exports = router;