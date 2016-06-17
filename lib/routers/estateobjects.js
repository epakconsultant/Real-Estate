/*
** Estateobjects router
*/

// Estateobjects controller
var CreateClientController = function (options) {

    var template,
        increment,
        clientsUrl;

    options = options || {};

    increment = options.increment || 5;

    clientsUrl = '/' + template + '/';

    template = 'estateobjects';

    return RouteController.extend({

        'neededPermitions': ['read', 'edit'],

        'resource': 'estateobjects',

        'template': template,

        'increment': increment,

        'limit': function () {

            return parseInt(this.params.estateobjectsLimit, 10) || this.increment;
        },

        'findOptions': function () {

            return {

                'limit': this.limit(), // checked
                'query': this.query(), // checked
                'street': this.street(), // checked
                'cityblock_id': this.cityblock_id(), // checked
                'category': this.category(), // checked
                'yearOfEndStart': this.yearOfEndStart(), // checked
                'yearOfEndEnd': this.yearOfEndEnd(), // checked
                'wallstype_id': this.wallstype_id(), // checked
                'estateobjectStatus': this.estateobjectStatus() // checked
            };
        },

        'query': function () {

            return YaFilter.clean({
                'source': s(this.params.query.search).trim().value(),
                'type': 'stringUrl'
            }) || '';
        },

        'street': function () {

            return YaFilter.clean({
                'source': s(this.params.query.street).trim().value(),
                'type': 'stringUrl'
            }) || '';
        },

        'cityblock_id': function () {

            var cityblock_id = this.params.query.cityblock_id;


            if (!_.isArray(cityblock_id)) {

                cityblock_id = [];
            }

            var new_cityblock_id = [];

            _.each(cityblock_id, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({

                    'source': s(element).trim().value(),
                    'type': 'alNum'
                }) || '';

                if (newVal) {

                    new_cityblock_id.push(newVal);
                }
            });

            return new_cityblock_id;
        },

        'category': function () {

            var category = this.params.query.category;

            if (!_.isArray(category)) {

                category = [];
            }

            var new_category = [];

            _.each(category, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({
                    'source': s(element).trim().value(),
                    'type': 'Word'
                }) || '';

                if (!(newVal !== 'newbuild' && newVal !== 'oldbuild')) {

                    new_category.push(newVal);
                }
            });

            return new_category;
        },

        'yearOfEndStart': function () {

            return +YaFilter.clean({
                'source': s(this.params.query.yearOfEndStart).trim().value(),
                'type': 'Int'
            }) || 0;
        },

        'yearOfEndEnd': function () {

            return +YaFilter.clean({
                'source': s(this.params.query.yearOfEndEnd).trim().value(),
                'type': 'Int'
            }) || 0;
        },

        'wallstype_id': function () {

            var wallstype_id = this.params.query.wallstype_id;


            if (!_.isArray(wallstype_id)) {

                wallstype_id = [];
            }

            var new_wallstype_id = [];

            _.each(wallstype_id, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({

                    'source': s(element).trim().value(),
                    'type': 'alNum'
                }) || '';

                if (newVal) {

                    new_wallstype_id.push(newVal);
                }
            });

            return new_wallstype_id;
        },

        'estateobjectStatus': function () {

            var estateobjectStatus = this.params.query.estateobjectStatus;

            if (!_.isArray(estateobjectStatus)) {

                estateobjectStatus = [];
            }

            var new_estateobjectStatus = [];

            _.each(estateobjectStatus, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({
                    'source': s(element).trim().value(),
                    'type': 'Word'
                }) || '';

                if (!(newVal !== 'active' && newVal !== 'archive')) {

                    new_estateobjectStatus.push(newVal);
                }
            });

            return new_estateobjectStatus;
        },

        'subscriptions': function () {

            return [
                Meteor.subscribe('citiesByUser'),
                Meteor.subscribe('cityblocksByUser'),
                Meteor.subscribe('wallstypesList'),
                Meteor.subscribe('estateobjects', this.findOptions())
            ];
        },

        'estateobjects': function () {

            return EstateObjects.find();
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
                searchQuery,
                searchQuerySet;

            query = this.query();

            // Create backlink url for detail page
            urlLimit = (this.limit() === this.increment) ? '' : this.limit();

            searchQuery = '';

            if (this.query()) {

                searchQuery = 'search=' + encodeURIComponent(this.query());
            }

            if (this.street()) {

                if (searchQuery) {

                    searchQuery = searchQuery + '&'
                }
                searchQuery = 'street=' + encodeURIComponent(this.street());
            }

            if (this.yearOfEndStart()) {

                if (searchQuery) {

                    searchQuery = searchQuery + '&'
                }
                searchQuery = 'yearOfEndStart=' + encodeURIComponent(this.yearOfEndStart());
            }

            if (this.yearOfEndEnd()) {

                if (searchQuery) {

                    searchQuery = searchQuery + '&'
                }
                searchQuery = 'yearOfEndEnd=' + encodeURIComponent(this.yearOfEndEnd());
            }

            if (this.cityblock_id().length) {

                if (searchQuery) {

                    _.each(this.cityblock_id(), function (element) {

                        searchQuery = searchQuery + '&cityblock_id[]=' + encodeURIComponent(element);
                    });

                } else {

                    _.each(this.cityblock_id(), function (element, index) {

                        if (index === 0) {

                            searchQuery = 'cityblock_id[]=' + element;
                        } else {

                            searchQuery = searchQuery + '&cityblock_id[]=' + encodeURIComponent(element);
                        }
                    });
                }
            }

            if (this.category().length) {

                if (searchQuery) {

                    _.each(this.category(), function (element) {

                        searchQuery = searchQuery + '&category[]=' + encodeURIComponent(element);
                    });

                } else {

                    _.each(this.category(), function (element, index) {

                        if (index === 0) {

                            searchQuery = 'category[]=' + element;
                        } else {

                            searchQuery = searchQuery + '&category[]=' + encodeURIComponent(element);
                        }
                    });
                }
            }

            if (this.wallstype_id().length) {

                if (searchQuery) {

                    _.each(this.wallstype_id(), function (element) {

                        searchQuery = searchQuery + '&wallstype_id[]=' + encodeURIComponent(element);
                    });

                } else {

                    _.each(this.wallstype_id(), function (element, index) {

                        if (index === 0) {

                            searchQuery = 'wallstype_id[]=' + element;
                        } else {

                            searchQuery = searchQuery + '&wallstype_id[]=' + encodeURIComponent(element);
                        }
                    });
                }
            }

            if (this.estateobjectStatus().length) {

                if (searchQuery) {

                    _.each(this.estateobjectStatus(), function (element) {

                        searchQuery = searchQuery + '&estateobjectStatus[]=' + encodeURIComponent(element);
                    });

                } else {

                    _.each(this.category(), function (element, index) {

                        if (index === 0) {

                            searchQuery = 'estateobjectStatus[]=' + element;
                        } else {

                            searchQuery = searchQuery + '&estateobjectStatus[]=' + encodeURIComponent(element);
                        }
                    });
                }
            }

            // Load more link flag
            hasMore = this.estateobjects().fetch().length === this.limit();


            if (searchQuery) {

                nextPath = this.route.path({estateobjectsLimit: this.limit() + this.increment}, {query: searchQuery});
            } else {

                nextPath = this.route.path({estateobjectsLimit: this.limit() + this.increment});
            }


            return {
                'estateobjects': this.estateobjects(),
                'cities': Cities.find({isActive: true}),
                'nextPath': hasMore ? nextPath : null,
                'formAction': template,
                'query': this.query(),
                'street': this.street(),
                'cityblock_id': this.cityblock_id(),
                'wallstype_id': this.wallstype_id(),
                'categories': this.category(),
                'estateobjectStatuses': this.estateobjectStatus(),
                'yearOfEndStart': this.yearOfEndStart(),
                'yearOfEndEnd': this.yearOfEndEnd()
            };
        }
    });
}


// Estateobject detail page
Router.map(function () {

    this.route('estateobject', {

        'path': '/admin/estateobject/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return EstateObjects.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return [
                Meteor.subscribe('citiesByUser'),
                Meteor.subscribe('cityblocksByUser'),
                Meteor.subscribe('wallstypesList'),
                Meteor.subscribe('estateobjectById', _id)
            ];
        }
    });
});

// New estateobject creation
Router.map(function () {

    this.route('estateobjectNew', {

        'path': '/admin/newestateobject',

        'waitOn': function () {

            return [
                Meteor.subscribe('citiesByUser'),
                Meteor.subscribe('cityblocksByUser'),
                Meteor.subscribe('wallstypesList')
            ];
        },

        'data': function() {

            var phone;

            phone = YaFilter.clean({

                'source': s(this.params.query.phone).trim().value(),
                'type': 'Number'
            }) || '';


            return {
                'phone': phone
            };
        }
    });
});


// Active estateobjects list
Router.map(function () {

    this.route('estateobjects', {

        'path': '/admin/estateobjects/:estateobjectsLimit?',

        'controller': CreateClientController()
    });
});
