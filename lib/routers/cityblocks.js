// Cityblocks
Router.map(function () {

    this.route('cityblocks', {

        'path': '/admin/cityblocks',

        'data': function () {

            return {
                'cityblocks': CityBlocks.find(),
                'cities': Cities.find()
            };
        },

        'waitOn': function () {

            return [
                Meteor.subscribe('cities'),
                Meteor.subscribe('cityblocks')
            ];
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'cityblocks'
        })
    });
});

// Cityblocks by city
Router.map(function () {

    this.route('cityblocksByCity', {

        'path': '/admin/cityblocks/bycity/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return {
                'cityblocks': CityBlocks.find(),
                '_id': _id
            };
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return [Meteor.subscribe('cities'), Meteor.subscribe('cityblockByCity', _id)];
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'cityblocks'
        })
    });
});

// Cityblock details
Router.map(function () {

    this.route('cityblock', {

        'path': '/admin/cityblocks/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return CityBlocks.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return [
                Meteor.subscribe('cities'),
                Meteor.subscribe('cityblockById', _id)
            ];
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'cityblocks'
        })
    });
});

// New cityblock
Router.map(function () {

    this.route('cityblockNew', {

        'path': '/admin/newcityblock',

        'data': function () {

            return {
                'cities': Cities.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('cities');
        },

        'controller': RouteController.extend({
            'neededPermitions': ['create'],
            'resource': 'cityblocks'
        })
    });
});
