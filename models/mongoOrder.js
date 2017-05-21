/*
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
                                                 }) */ /*
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
}); */
/*
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
}); */ /*
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
}); */