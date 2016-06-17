// Users
Router.map(function () {

    this.route('users', {

        'path': '/admin/users',

        'data': function () {

            var users;

            users = _(Meteor.users.find().fetch()).sortBy(function (user) {

                return [user.cityName, user.namelast];
            });

            return {
                'users': users,
                'cities': Cities.find({isActive: true})
            };
        },

        'waitOn': function () {

            return [
                Meteor.subscribe('cities'),
                Meteor.subscribe('users')
            ];
        }
    });
});

// User detail
Router.map(function () {

    this.route('user', {

        'path': '/admin/users/:_id',

        'data': function () {

            var _id;

            _id = YaFilter.clean({
                'source': s(this.params._id).trim().value(),
                'type': 'AlNum'
            });

            return Meteor.users.findOne(_id);
        },

        'waitOn': function () {

            return [
                Meteor.subscribe('cities'),
                Meteor.subscribe('users')
            ];
        }
    });
});

// New user
Router.map(function () {

    this.route('userNew', {

        'path': '/admin/newuser',

        'data': function () {

            return {
                'cities': Cities.find({isActive: true})
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('cities');
        }
    });
});
