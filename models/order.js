var mysql = require('../db.js');

var Client = require('pg').Client;
const pg = require('pg');
const config = require('../config.js');

var Order = function () {
    email = '';
    wachtwoord = '';
    ticketID = '';
    incheckTijd = '';
    aantalGebruikersBinnen = '';
    email = '';
    totaalAantalTickets = '';
};

/*
var conn = new Client(config.conn);
conn.connect();

var rollback = function (conn) {
    //terminating a conn connection will
    //automatically rollback any uncommitted transactions
    //so while it's not technically mandatory to call
    //ROLLBACK it is cleaner and more correct
    conn.query('ROLLBACK', function () {

    });
};

Order.insertNewOrder = function (obj, callback) {
    var idOrder = 0;
    var QRdata = new Array();
    var OrderData = new Array();
    var query = "INSERT INTO `Order` VALUES(NULL,?,?,?,?) RETURNING `idOrder`;";
    mysql.connection(function (err, rows){
        if(err) { return callback(err); }
    //New Order
    conn.query(query, [obj.email, obj.dag, obj.ticketStatus, obj.hash], function(err, rows){
        if(err) { console.log(' ==== Order ====' + err);
                  return callback(err, null);
                }
        for(var a = 0; a <obj["items"]["diner"].length; a++)
    })
    
    
    //Brandon's Madness
    conn.query('BEGIN', function (err, result) {
        if (err) { console.log(err); rollback(conn); return callback(err, null); }
        conn.query("INSERT INTO `Order` VALUES(?,?,?,?,?) RETURNING `idOrder`;", )
        //New Order

        conn.query('INSERT INTO "Order" ("idOrder", "orderDate", "orderPrice", "orderState", "orderPaid") VALUES ($1, $2, $3, FALSE, FALSE) RETURNING "idOrder";', [randomString(34, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), moment().format("lll"), obj["price"]["totalprice"]], function (err, result) {
            if (err) {
                console.log(' ==== O40 ===' + err);
                rollback(conn); return callback;
            }
                          for (var a = 0; a < obj["items"]["diner"].length; a++) {
                    //insert new Diner
                    conn.query('INSERT INTO "Meal" ("foodType", "barcode", "foodtime", "mealDate", "used") VALUES (FALSE, $1, TRUE, $2, FALSE) RETURNING "idMeal";', [randomString(34, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), obj["items"]["diner"][a]], function (err, result) {
                        //disconnect after successful commit
                        if (err) {
                            console.log(' ==== O57 ===' + err);
                            rollback(conn); return callback;
                        }

                        let idm = result.rows[0].idMeal;
                        var svg_string = qr.svgObject(idm, { type: 'svg' });
                        var qrdata = {
                            pdfstring: "Diner voor Dag " + (parseInt(obj["items"]["diner"][a]) + 1),
                            svg: svg_string.path
                        };
                        QRdata.push(qrdata);
                        //Assign diner to orderID
                        conn.query('INSERT INTO "orderMeals" ("idMeals", "idOrders") VALUES ($1, $2);', [idm, ido], function (err, result) {
                            //disconnect after successful commit
                            if (err) {
                                console.log(' ==== O65 ===' + err);
                                rollback(conn); return callback;
                            }
                            console.log("klaar met diner");



                        });
                    });
                } for (let a = 0; a < obj["items"]["lunch"].length; a++) {
                    //insert new Diner
                    conn.query('INSERT INTO "Meal" ("foodType", "barcode", "foodtime", "mealDate", "used") VALUES (FALSE, $1, TRUE, $2, FALSE) RETURNING "idMeal";', [randomString(34, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'), obj["items"]["lunch"][a]], function (err, result) {
                        //disconnect after successful commit
                        if (err) {
                            console.log(' ==== O85 ===' + err);
                            rollback(conn); return callback;
                        }
                        let idm = result.rows[0].idMeal;
                        var svg_string = qr.svgObject(idm, { type: 'svg' });
                        var qrdata = {
                            pdfstring: "Lunch voor Dag " + (parseInt(obj["items"]["lunch"][a]) + 1),
                            svg: svg_string.path
                        };
                        QRdata.push(qrdata);
                        //Assign diner to orderID
                        conn.query('INSERT INTO "orderMeals" ("idMeals", "idOrders") VALUES ($1, $2);', [idm, ido], function (err, result) {
                            //disconnect after successful commit
                            if (err) {
                                console.log(' ==== O93 ===' + err);
                                rollback(conn); return callback;
                            }
                            console.log("klaar met lunch");
                        });
                    });
                }

                for (let b = 0; b < obj["items"]["tickets"].length; b++) {
                    //Create new ticket
                    conn.query('INSERT INTO "Ticket" ("ticketIn", "ticketDay", "barcode") VALUES (FALSE, $1, $2) RETURNING "idTicket";', [obj["items"]["tickets"][a], randomString(34, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ')], function (err, result) {
                        //disconnect after successful commit
                        if (err) {
                            console.log(' ==== O106 ===' + err);
                            rollback(conn); return callback;
                        }
                        console.log("klaar met Tickets");
                        let idt = result.rows[0].idTicket;
                        var svg_string = qr.svgObject(idt, { type: 'svg' });
                        var qrdata = {
                            pdfstring: "Ticket voor Dag " + (parseInt(obj["items"]["tickets"][a]) + 1),
                            svg: svg_string.path
                        };
                        QRdata.push(qrdata);
                        //Assign ticket to an order
                        console.log("order nummer is " + idt);
                        conn.query('INSERT INTO "orderTickets" ("idTicket", "idOrder") VALUES ($1, $2);', [idt, ido], function (err, result) {
                            //disconnect after successful commit
                            if (err) {
                                rollback(conn); return callback;
                            }
                            console.log("Klaar met ordertickets");

                            switch (parseInt(obj["items"]["tickets"][a])) {
                                case 0:
                                    conn.query('UPDATE "TicketSales" SET "Friday" = "Friday" - 1;', function (err, result) {

                                        //disconnect after successful commit
                                        if (err) {
                                            console.log(' ==== O141 ===' + err);
                                            rollback(conn); return callback;
                                        }
                                    });
                                    break;
                                case 1:
                                    conn.query('UPDATE "TicketSales" SET "Saturday" = "Saturday" - 1;', function (err, result) {

                                        //disconnect after successful commit
                                        if (err) {
                                            console.log(' ==== O141 ===' + err);
                                            rollback(conn); return callback;
                                        }
                                    });
                                    break;
                                case 2:

                                    conn.query('UPDATE "TicketSales" SET "Sunday" = "Sunday" - 1;', function (err, result) {

                                        //disconnect after successful commit
                                        if (err) {
                                            console.log(' ==== O141 ===' + err);
                                            rollback(conn); return callback;
                                        }
                                    });
                                    break;

                            }
                            //Tickets verlagen voor de gekozen dagen
                            console.log(JSON.stringify(QRdata));
                            console.log("Tickets verlaagd");
                            function stringToAscii(s) {
                                var ascii = "";
                                if (s.length > 0)
                                    for (var i = 0; i < s.length; i++) {
                                        var c = "" + s.charCodeAt(i);
                                        while (c.length < 3)
                                            c = "0" + c;
                                        ascii += c;
                                    }
                                return (ascii);
                            }
                            let q = stringToAscii(ido);
                            var pdfName = q + ".pdf";

                            var OrderPDF = new pdfkit;

                            console.log(obj["price"].ticketprice);
                            console.log(obj["price"].totalfoodprice);


                            OrderPDF.pipe(fs.createWriteStream(pdfName));

                            OrderPDF
                                .font('Times-Roman')
                                .fontSize(25)
                                .text('Factuur', 100, 80);

                            OrderPDF
                                .font('Times-Roman')
                                .fontSize(13)
                                .text('Ticketprijs  ' + obj["price"].ticketprice + ',-', 200, 180);

                            if (obj["price"].totalfoodprice != 0) {
                                OrderPDF
                                    .font('Times-Roman')
                                    .fontSize(13)
                                    .text('Voedselprijs  ' + obj["price"].totalfoodprice + ',-', 200, 280);

                            }

                            for (let pageCount = 0; pageCount < QRdata.length; pageCount++) {
                                console.log('nieuwepagina');
                                OrderPDF.addPage()
                                //Elke keer draaien als er een barcode moet worden geplaatst
                                OrderPDF
                                    .font('Times-Roman')
                                    .fontSize(25)
                                    .text(QRdata[pageCount].pdfstring, 100, 80);

                                OrderPDF.scale(10)
                                    .translate(10, 15)
                                    .path(QRdata[pageCount].svg)
                                    .fill('blue', 'even-odd')
                                    .restore();

                            }
                            console.log('klaar');
                            OrderPDF.end();

                            function sendPDF() {
                                User.getUserEmailByID(obj["idUser"], function (err, result) {

                                    if (err) {
                                        console.log(err);

                                    } else {
                                        let UserMail = result;

                                        var helper = require('sendgrid').mail;
                                        var mail = new helper.Mail();


                                        var attachment = new helper.Attachment();
                                        var file = fs.readFileSync(pdfName);
                                        var base64File = new Buffer(file).toString('base64');
                                        attachment.setContent(base64File);
                                        attachment.setType('application/tpdf');
                                        attachment.setFilename(pdfName);
                                        attachment.setDisposition('attachment');
                                        mail.addAttachment(attachment);



                                        var email = new helper.Email(UserMail, 'Example User');
                                        mail.setFrom(email);

                                        mail.setSubject('Uw kaarten voor conferentie ICT');

                                        var personalization = new helper.Personalization();
                                        email = new helper.Email(UserMail, 'Example User');
                                        personalization.addTo(email);
                                        mail.addPersonalization(personalization);

                                        var content = new helper.Content('text/html', 'In de bijlage kan u uw bestellingsresultaten vinden voor de conferentie')
                                        mail.addContent(content);


                                        var sg = require('sendgrid')(config.sengridAPI);
                                        var request = sg.emptyRequest({
                                            method: 'POST',
                                            path: '/v3/mail/send',
                                            body: mail.toJSON()
                                        });

                                        sg.API(request, function (error, response) {
                                            console.log(response.statusCode);
                                            console.log(response.body);
                                            console.log(response.headers);
                                        });
                                    }


                                });
                            } setTimeout(sendPDF, 3000);

                        });


                    });


                }






            });

            //Commit transactie

            console.log("commit uitgevoerd");
            conn.query('COMMIT');
            return callback(null, ido);
        });

    });






}
*/
module.exports = Order;