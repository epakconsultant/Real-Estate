Template.estateobjects.helpers({

    'cityblocks': function () {

        var loggedInUser,
            cityblocks,
            that;


        that = this;


        loggedInUser = Meteor.user();

        cityblocks = CityBlocks.find().fetch();

        _.each(cityblocks, function (value) {

            if (_.indexOf(that.cityblock_id, value._id) != -1) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return cityblocks;
    },

    'wallstypes': function () {

        var wallstypes,
            that;


        that = this;


        wallstypes = Wallstypes.find().fetch();

        _.each(wallstypes, function (value) {

            if (_.indexOf(that.wallstype_id, value._id) != -1) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return wallstypes;
    },

    'categories': function () {

        var categories,
            that;


        that = this;


        categories = [
            {
                '_id': 'newbuild',
                'categoryName': 'Новостройка'
            },
            {
                '_id': 'oldbuild',
                'categoryName': 'Вторичное жилье'
            }
        ];

        _.each(categories, function (value) {

            if (_.indexOf(that.categories, value._id) != -1) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return categories;
    },

    'estateobjectStatuses': function () {

        var estateobjectStatuses,
            that;


        that = this;


        estateobjectStatuses = [
            {
                '_id': 'active',
                'estateobjectStatusName': 'Активный'
            },
            {
                '_id': 'archive',
                'estateobjectStatusName': 'Архивный'
            }
        ];

        _.each(estateobjectStatuses, function (value) {

            if (_.indexOf(that.estateobjectStatuses, value._id) != -1) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return estateobjectStatuses;
    }
});

Template.estateobjects.rendered = function() {

    $('#cityblock_id').select2({
        placeholder: 'Район города'
    });

    $('#wallstype_id').select2({
        placeholder: 'Тип стен'
    });

    $('#category').select2({
        placeholder: 'Категория'
    });

    $('#estateobjectStatus').select2({
        placeholder: 'Статус'
    });
};

Template.estateobjects.events({

    'click .active-obj': function (e) {

        var id;

        e.preventDefault();

        id = $(e.target).data('id');

        id = YaFilter.clean({
            'source': s(id).trim().value(),
            'type': 'AlNum'
        });

        Meteor.call('estateobjectArchive', id, function (error) {

            if (error) {

                // display the error to the user
                showNotice('error', error.reason);
            } else {

                showNotice('note', 'Объект архивирован');
            }
        });
    },

    'click .archive-obj': function (e) {

        var id;

        e.preventDefault();

        id = $(e.target).data('id');

        id = YaFilter.clean({
            'source': s(id).trim().value(),
            'type': 'AlNum'
        });

        Meteor.call('estateobjectActive', id, function (error) {

            if (error) {

                // display the error to the user
                showNotice('error', error.reason);
            } else {

                showNotice('note', 'Объект активирован');
            }
        });
    }
});
