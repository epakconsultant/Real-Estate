// Roles
Router.map(function () {

    this.route('permitions', {

        'path': '/admin/permitions',

        'data': function () {

            return {
                'roles': AclRoles.find(),
                'resources': Resources.find(),
                'permitions': RolesPermitions.find()
            };
        },

        'waitOn': function () {

            return [
                Meteor.subscribe('allRoles'),
                Meteor.subscribe('allResources'),
                Meteor.subscribe('allPermitions')
            ]
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'edit', 'create', 'delete'],
            'resource': 'roles'
        })
    });
});
