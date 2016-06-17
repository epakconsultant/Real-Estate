Template.accountLinks.helpers({

    'userName': function () {

        var currentUser;

        currentUser = Meteor.user();

        if (currentUser) {

            return currentUser.fullname;
        }
    }
});

Template.accountLinks.events({

    'click #logout-btn': function (e) {

        e.preventDefault();

        Meteor.logout(function (error) {

            if (error) {

                showNotice('error', 'Error when you log out ');
            }

            Router.go('indexPage');
        });
    }
});