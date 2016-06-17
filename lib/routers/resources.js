// Resources
Router.map(function () {

    this.route('resources', {

        'path': '/admin/resources',

        'data': function () {

            return {
                'resources': Resources.find()
            };
        },

        'waitOn': function () {

            return Meteor.subscribe('allResources');
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit', 'delete'],
            'resource': 'roles'
        })
    });
});

// New resource
Router.map(function () {

    this.route('resourceNew', {

        'path': '/admin/newresource',

        'controller': RouteController.extend({
            'neededPermitions': ['create'],
            'resource': 'roles'
        })
    });
});
