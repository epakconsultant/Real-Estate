// Wallstypes
Router.map(function () {

    this.route('wallstypes', {

        'path': '/admin/wallstypes',

        'data': function () {

            return {
                'wallstypes': Wallstypes.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('wallstypes');
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'wallstypes'
        })
    });
});

// Wallstype detail
Router.map(function () {

    this.route('wallstype', {

        'path': '/admin/wallstypes/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Wallstypes.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Meteor.subscribe('wallstypeById', _id);
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'wallstypes'
        })
    });
});

// New wallstype
Router.map(function () {

    this.route('wallstypeNew', {

        'path': '/admin/newwallstype',

        'controller': RouteController.extend({
            'neededPermitions': ['create'],
            'resource': 'wallstypes'
        })
    });
});
