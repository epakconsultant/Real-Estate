// Cities
Router.map(function () {

    this.route('cities', {

        'path': '/admin/cities',

        'data': function () {

            return {
                'cities': Cities.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('cities');
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'cities'
        })
    });
});

// City detail
Router.map(function () {

    this.route('city', {

        'path': '/admin/cities/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                source: s(this.params._id).trim().value(),
                type: 'AlNum'
            });


            return Cities.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                source: s(this.params._id).trim().value(),
                type: 'AlNum'
            });

            return Meteor.subscribe('cityById', _id);
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'cities'
        })
    });
});

// New city
Router.map(function () {

    this.route('cityNew', {

        'path': '/admin/newcity',

        'controller': RouteController.extend({
            'neededPermitions': ['create'],
            'resource': 'cities'
        })
    });
});
