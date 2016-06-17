Template.resources.events({

    'click .archiveBtn': function (e) {

        var id;

        e.preventDefault();

        id = $(e.target).data('id');

        id = YaFilter.clean({
            'source': s(id).trim().value(),
            'type': 'AlNum'
        });

        Meteor.call('resourceRemove', id, function (error) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при удалении ресурса.');
            } else {

                showNotice('note', 'Ресурс удален.');
            }
        });
    }
});
