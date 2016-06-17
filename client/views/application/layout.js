Template.layout.rendered = function () {

    $(document).scroll(function () {

        if ($(document).scrollTop() > 0) {

            $('#toTopBtn').css({
                'display': 'inline-block'
            });
        } else {

            $('#toTopBtn').css({
                'display': 'none'
            });
        }
    });
};

Template.layout.helpers({
    'isAdmin': function () {

        var currUrl = Router.current().route.path(this).toString();

        if (currUrl.indexOf('admin') !== -1) {

            return true;
        }

        return false;
    }
});

Template.layout.events({

    'click #toTopBtn': function (e) {

        e.preventDefault();

        $(document).scrollTop(0);
    }
});
