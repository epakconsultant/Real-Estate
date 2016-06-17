// Typeofestate
Router.map(function () {

    this.route('typeofestates', {

        'path': '/admin/typeofestates',

        'data': function () {

            return {
                'typeofestates': Typeofestates.find()
            };
        },

        'waitOn': function() {

            return Meteor.subscribe('typeofestates');
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'typeofestates'
        })
    });
});

// Typeofestate detail
Router.map(function () {

    this.route('typeofestate', {

        'path': '/admin/typeofestates/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Typeofestates.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Meteor.subscribe('typeofestateById', _id);
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'typeofestates'
        })
    });
});

// New typeofestate
Router.map(function () {

    this.route('typeofestateNew', {

        'path': '/admin/newtypeofestate',

        'controller': RouteController.extend({
            'neededPermitions': ['create'],
            'resource': 'typeofestates'
        })
    });
});
