// Roles
Router.map(function () {

    this.route('roles', {

        'path': '/admin/roles',

        'data': function () {

            return {
                'roles': AclRoles.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('allRoles');
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit', 'delete'],
            'resource': 'roles'
        })
    });
});

// New role
Router.map(function () {

    this.route('roleNew', {

        'path': '/admin/newrole',

        'controller': RouteController.extend({
            'neededPermitions': ['create'],
            'resource': 'roles'
        })
    });
});
