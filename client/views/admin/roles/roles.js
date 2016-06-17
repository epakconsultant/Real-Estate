Template.roles.events({

    'click .archiveBtn': function (e) {

        var id;

        e.preventDefault();

        id = $(e.target).data('id');

        id = YaFilter.clean({
            'source': s(id).trim().value(),
            'type': 'AlNum'
        });

        Meteor.call('roleRemove', id, function (error) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при удалении роли.');
            } else {

                showNotice('note', 'Роль удалена.');
            }
        });
    }
});
