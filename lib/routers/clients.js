/*
** Clients router
*/

// Clients controller
var CreateClientController = function (options) {

    var template,
        increment,
        clientsStatus, // 'active', 'adv', 'archive'
        clientsUrl; // '/clients/', '/clientsadv/', '/clientsarchive/'

    options = options || {};

    increment = options.increment || 5;
    clientsStatus = options.clientsStatus || 'active';


    // Clear client status string
    if (clientsStatus !== 'active' && clientsStatus !== 'adv' && clientsStatus !== 'archive' && clientsStatus !== 'new') {

        clientsStatus = 'active';
    }


    template = 'clients';

    if (clientsStatus === 'adv' || clientsStatus === 'archive' || clientsStatus === 'new') {

        template = template + clientsStatus;
    }


    clientsUrl = '/' + template + '/';


    return RouteController.extend({

        'template': template,

        'increment': increment,

        'limit': function () {

            return parseInt(this.params.clientsLimit) || this.increment;
        },

        'findOptions': function () {

            return {

                'limit': this.limit(),
                'query': this.query(),
                'clientStatus': (clientsStatus === 'adv') ? ['adv', 'new'] : [clientsStatus]
            };
        },

        'query': function () {

            return YaFilter.clean({

                'source': s(this.params.query.search).trim().value(),
                'type': 'stringUrl'
            }) || '';
        },

        'subscriptions': function () {

            return [
                Meteor.subscribe('citiesByUser'),
               // Meteor.subscribe('blacklist'),
                Meteor.subscribe('typeofestates'),
                Meteor.subscribe('clientsList', this.findOptions())
            ];
        },

        'clients': function () {

            return Clients.find();
        },

        'action': function () {

            if (this.ready()) {

                this.render();
            } else {

              this.render('loadingDown', {to: 'load'});
            }

        },

        'data': function () {

            var urlLimit,
                hasMore,
                nextPath,
                query,
                searchQuery;

            query = this.query();

            // Create backlink url for detail page
            urlLimit = (this.limit() === this.increment) ? '' : this.limit();

            searchQuery = '';

            if (this.query()) {
                searchQuery = '?search=' + this.query();
            }

            // Set backlink url for detail page in session
            Session.set('clientsUrl', clientsUrl + urlLimit + searchQuery);

            // Load more link flag
            hasMore = this.clients().fetch().length === this.limit();


            if (query) {

                query = 'search=' + query;
                nextPath = this.route.path({clientsLimit: this.limit() + this.increment}, {query: query});
            } else {

                nextPath = this.route.path({clientsLimit: this.limit() + this.increment});
            }


            return {
                'clients': this.clients(),
                'cities': Cities.find({isActive: true}),
                'nextPath': hasMore ? nextPath : null,
                'clientsStatus': clientsStatus
            };
        }
    });
}


// Client detail page
Router.map(function() {

    this.route('client', {

        'path': '/admin/client/:_id',

        'data': function() {

            var _id;

            _id = YaFilter.clean({
                source: s(this.params._id).trim().value(),
                type: 'AlNum'
            });

            return Clients.findOne(_id);
        },

        'waitOn': function() {

            _id = YaFilter.clean({
                source: s(this.params._id).trim().value(),
                type: 'AlNum'
            });

            return [
                Meteor.subscribe('citiesByUser'),
                Meteor.subscribe('cityblocksByUser'),
                Meteor.subscribe('tariffByUser'),
                //Meteor.subscribe('contracts'),
                Meteor.subscribe('paymentsByClient', _id),
                Meteor.subscribe('sources'),
                Meteor.subscribe('typeofestates'),
                Meteor.subscribe('userByClientId', _id),
                Meteor.subscribe('clientById', _id),
                Meteor.subscribe('subscribtionsByClientId', _id)
            ];
        }
    });
});

// New client creation
Router.map(function() {

    this.route('clientNew', {

        'path': '/admin/newclient',

        'waitOn': function() {

            return [
                Meteor.subscribe('citiesByUser'),
                Meteor.subscribe('cityblocksByUser'),
                //Meteor.subscribe('contracts'),
                Meteor.subscribe('sources'),
                Meteor.subscribe('typeofestates')
            ];
        }
    });
});


// Active clients list
Router.map(function () {

    this.route('clients', {

        'path': '/admin/clients/:clientsLimit?',

        'controller': CreateClientController()
    });
});

// Adv clients list
Router.map(function () {

    this.route('clientsreg', {

        'path': '/clientsreg/:clientsLimit?',

        'controller': CreateClientController({
            'clientsStatus': 'new'
        })
    });
});


// Adv clients list
Router.map(function () {

    this.route('clientsadv', {

        'path': '/admin/clientsadv/:clientsLimit?',

        'controller': CreateClientController({
            'clientsStatus': 'adv'
        })
    });
});


// Archive clients list
Router.map(function () {

    this.route('clientsarchive', {

        'path': '/admin/clientsarchive/:clientsLimit?',

        'controller': CreateClientController({
            'clientsStatus': 'archive'
        })
    });
});
