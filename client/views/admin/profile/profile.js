Template.profile.events({

    'click #saveBtn': function (e) {

        var entity,
            entityId;

        e.preventDefault();

        entity = {

            'oldPassword': $.trim(YaRequest.getAlnum('oldPassword', '', 'INPUT')),

            'newPassword': $.trim(YaRequest.getAlnum('newPassword', '', 'INPUT'))

        };


        if (!entity.oldPassword) {

            $('#oldPassword').addClass('invalid');
            return;
        }

        if (!entity.newPassword) {

            $('#newPassword').addClass('invalid');
            return;
        }

        Accounts.changePassword(entity.oldPassword, entity.newPassword, function (error) {

            if (error) {

                // display the error to the user
                showNotice('error', error.reason);
                $(document).scrollTop(0);
                return;
            } else {

                showNotice('note', 'Пароль успешно изменен.');
                $(document).scrollTop(0);
                return;
            }
        });
    }
});
