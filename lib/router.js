Router.configure({
    layoutTemplate: 'layout',
    loadingTemplate: 'loading'
});

Router.map(function () {
    this.route('indexPage', {
        'path': '/',
        'template': 'loginForm'
    });
});

Router.map(function () {
    this.route('loginForm', {
        'path': '/login'
    });
});


var BeforeHooks = {

    'isAllowed': function () {

        var that = this;

        if (this.resource) {

            var neededPermitions = Acl.clearWords(this.neededPermitions);

            if (neededPermitions) {

                if (Acl.isAllowed(Meteor.userId(), this.resource, neededPermitions)) {

                    this.next();
                } else {

                    this.render('accessDenied');
                }
            } else {

                if (Acl.isAllowed(Meteor.userId(), this.resource, ['read'])) {

                    this.next();
                } else {

                    this.render('accessDenied');
                }
            }
        } else {

            this.next();
        }
    },

    'setActiveMenu': function () {

        if (Meteor.isClient) {

            Session.set('activeMenuItem', Router.current().route.getName());
        }

        this.next();
    },

    'clearNotice': function() {

        clearNotice();
        this.next();
    }
}

_.each(BeforeHooks, function (BeforeHook) {

    Router.onBeforeAction(BeforeHook);
});
