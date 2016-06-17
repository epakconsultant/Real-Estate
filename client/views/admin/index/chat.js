Template.chat.helpers({
    'messages': function () {

        return Chat.find({}, {
            'sort': {
                'creationDate': -1
            }
        })
    }
});

Template.chat.events({

    'submit #chat-form, keypress': function (e) {

        var entity,
            entityId,
            haveErrors = false,
            errors = [];

        if (!(e.type === 'keypress' && e.which === 13) && e.type !== 'submit') {

            return;
        }

        e.preventDefault();

        $('.invalid').removeClass('invalid');

        entity = {
            'message': $.trim(YaRequest.getString('chatMsg', '', 'INPUT'))
        };

        if (!entity.message) {

            errors.push('message');
            haveErrors = true;
        }

        if (haveErrors) {

            _.each(errors, function (element) {

                $('#' + element).addClass('invalid');
            });

            showNotice('error', 'Некорректно заполнены поля.'); // ToDo - Add multulanguage support (Yackovlev)

            return;
        }

        Meteor.call('insertMessage', entity, function (error, result) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при сохранении.');
                return;
            } else {

                if (result && result.status == 'error') {

                    showNotice('error', result.message);
                    return;
                }

                $('#chatMsg').val('');
            }
        });
    }
});
