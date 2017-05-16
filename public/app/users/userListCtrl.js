var sess;
(function () {
    "use strict";
    angular
        .module('usersManagement', ['ui.router'])
        .config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
            $stateProvider
            .state('home',{
                url: '/home',
                templateUrl: 'views/partials/home.html.twig',
                controller: 'AgendaListCtrl as ctrl'
            })
            
                .state('home2', {
                    url: '',
                    templateUrl: 'views/partials/index.html'
                })
                .state('contact', {
                    url: '/contact',
                    templateUrl: 'views/partials/contact.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('agenda', {
                    url: '/agenda',
                    templateUrl: 'views/partials/agenda/agenda.html',
                    controller: "AgendaListCtrl as ctrl"
                })
                .state('registreren', {
                    url: '/registreren',
                    templateUrl: 'views/partials/registreren.html',
                   // controller: "UserListCtrl as ctrl"
                })
                .state('login', {
                    url: '/login',
                    templateUrl: 'views/partials/login.html',
                    controller: "UserLijstCtrl as ctrl"
                })
                .state('inschrijven', {
                    url: '/inschrijven',
                    templateUrl: 'views/partials/inschrijven.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('concert', {
                    url: '/addConcert',
                    templateUrl: 'views/partials/concert/addConcert.html',
                    controller: "UserListCtrl as ctrl"
                })
                .state('rol', {
                    url: '/addRol',
                    templateUrl: 'views/partials/gebruiker/addRol.html',
                    controller: "UserListCtrl as ctrl"
                })
                .state('GebruikerRol', {
                    url: '/GebruikerRol',
                    templateUrl: 'views/partials/gebruiker/GebruikerRol.html',
                    controller: "UserListCtrl as ctrl"
                })
                .state('Artiest', {
                    url: '/addArtiest',
                    templateUrl: 'views/partials/artiest/addArtiest.html',
                    controller: "UserListCtrl as ctrl"
                })
                .state('Genre', {
                    url: '/addGenre',
                    templateUrl: 'views/partials/artiest/addGenre.html',
                    controller: "UserListCtrl as ctrl"
                })
                .state('Zaal', {
                    url: '/addZaal',
                    templateUrl: 'views/partials/agenda/addZaal.html',
                    controller: "AdminCheck as ctrl",
                })
                .state('Categorie', {
                    url: '/addCategorie',
                    templateUrl: 'views/partials/email/addCategorie.html',
                    controller: "UserListCtrl as ctrl"
                })
                .state('AgendaAdd', {
                    url: '/addAgendaPunt',
                    templateUrl: 'views/partials/agenda/addAgendaPunt.html',
                    controller: "UserListCtrl as ctrl"
                })
                .state('AgendaList', {
                    url: '/agendaList',
                    templateUrl: 'views/partials/agenda/agenda.html',
                    controller: "AgendaLijstCtrl as ctrl"
                })
                .state('AgendaBackend', {
                    url: '/agendaBackend',
                    templateUrl: 'views/partials/agenda/agendaBackend.html',
                    controller: "AgendaLijstCtrl as ctrl"
                })
                .state('addBestelling', {
                    url: '/addBestelling',
                    templateUrl: 'views/partials/gebruiker/addBestelling.html',
                    controller: "PrijsLijstCtrl as ctrl"
                })
            //Backend views
                .state('admin', {
                    url: '/admin',
                    templateUrl: 'views/partials/backend/admin.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
            //Extra Opgave routes
                .state('Spec', {
                    url: '/addSpeciaalEvenement',
                    templateUrl: 'views/partials/agenda/addSpecEvenement.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('Onderhoud', {
                    url: '/newOnderhoud',
                    templateUrl: 'views/partials/agenda/addOnderhoud.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('Schoonmaken', {
                    url: '/newSchoonmaak',
                    templateUrl: 'views/partials/agenda/addSchoonmaak.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
            //Error & Succes meldingen
                .state('errorLogin', {
                    url: '/errorLogin',
                    templateUrl: 'views/partials/errors/errorLogin.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('errorMail', {
                    url: '/errorMail',
                    templateUrl: 'views/partials/errors/errorMail.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('errorConcert', {
                    url: '/errorConcert',
                    templateUrl: 'views/partials/errors/errorConcert.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('errorStandaard', {
                    url: '/errorStandaard',
                    templateUrl: 'views/partials/errors/errorStandaard.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('successLogin', {
                    url: '/successLogin',
                    templateUrl: 'views/partials/errors/successLogin.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('successRegistreer', {
                    url: '/successRegistreer',
                    templateUrl: 'views/partials/errors/successLogin.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('successBetaal', {
                    url: '/successBetaal',
                    templateUrl: 'views/partials/errors/successBetaal.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
                .state('successMail', {
                    url: '/successMail',
                    templateUrl: 'views/partials/errors/successMail.html',
                    //controller: "PrijsLijstCtrl as ctrl"
                })
        }])

    /*  .controller('UsersListCtrl', ['$http', UsersListCtrl]) */
        .controller('AgendaListCtrl', ['$http', AgendaListCtrl])
        .controller('AgendaLijstCtrl',['$http', AgendaLijstCtrl])
        .controller('PrijsLijstCtrl',['$http', PrijsLijstCtrl])
        .controller('AdminCheck', ['$http', AdminCheck])
    
    //AdminChecks
    function AdminCheck($http){
        console.log("Admin checken!");
        var self = this;
        
        $http.get('/addZaal')
            .success(function (data){
                console.log('yay');
            })
            .error(function (data) {
                console.log('Error: ' + data)
            });
    }
    
    function AgendaLijstCtrl($http) {
        console.log("Ik ben in Agenda");
        var self = this;

        $http.get('/agendaList')
            .success(function (data) {
                self.agenda = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data)
            });

        self.foto = false;

        self.fotoAanUit = function () {
            self.foto = !self.foto;
        }
    }
    function PrijsLijstCtrl($http) {
        console.log("Ik ben in PrijsLijst");
        var self = this;

        $http.get('/addBestelling')
            .success(function (data) {
                self.ShowPrijs = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data)
            });
    }
    
    function UserLijstCtrl($http) {
        console.log("Ik ben in gebruiker");
        var self = this;

        $http.get('/loginUser')
            .success(function (data) {
                self.ShowPrijs = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data)
            });
    }
    
    function AgendaListCtrl($http) {
        console.log("Ik ben in Agenda");
        var self = this;

        $http.get('/agenda')
            .success(function (data) {
                self.agenda = data;
                console.log(data);
            })
            .error(function (data) {
                console.log('Error: ' + data)
            });

        self.foto = false;

        self.fotoAanUit = function () {
            self.foto = !self.foto;
        }
    }
})();
