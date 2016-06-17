Router.map(function () {
    this.route('chat', {
        'path': '/admin',

        'data': function () {

            return {
                'messages': Chat.find()
            };
        },

        'subscriptions': function () {

            return [
                Meteor.subscribe('generalChat')
            ];
        },

        'controller': RouteController.extend({
            'neededPermitions': ['read', 'create'],
            'resource': 'chat'
        })
    });
});
