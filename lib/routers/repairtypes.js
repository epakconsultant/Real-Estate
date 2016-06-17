// Repairtypes
Router.map(function () {

    this.route('repairtypes', {

        'path': '/admin/repairtypes',

        'data': function () {

            return {
                'repairtypes': Repairtypes.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('repairtypes');
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'repairtypes'
        })
    });
});

// Repairtype detail
Router.map(function () {

    this.route('repairtype', {

        'path': '/admin/repairtypes/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Repairtypes.findOne(_id);
        },

        'waitOn': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Meteor.subscribe('repairtypeById', _id);
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'repairtypes'
        })
    });
});

// New repairtype
Router.map(function () {

    this.route('repairtypeNew', {

        'path': '/admin/newrepairtype',

        'controller': RouteController.extend({
            'neededPermitions': ['create'],
            'resource': 'repairtypes'
        })
    });
});
