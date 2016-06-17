// Profile detail
Router.map(function () {

    this.route('profile', {

        'path': '/admin/profile',

        'data': function () {

            var _id;

            _id = Meteor.userId

            return Meteor.users.findOne(_id);
        },

        'waitOn': function () {

            return [
                Meteor.subscribe('users')
            ];
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit'],
            'resource': 'profile'
        })
    });
});
