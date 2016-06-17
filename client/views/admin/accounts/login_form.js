Template.loginForm.events({

    'submit #login-form': function (e) {

        var loginVal,
            passwordVal;

        e.preventDefault();

        $('#login').removeClass('invalid');
        $('#password').removeClass('invalid');

        loginVal = $.trim(YaRequest.getAlnum('login', '', 'INPUT')); //YaUtilities.toMobile($.trim(YaRequest.getNumber('login', '', 'INPUT')));
        passwordVal = $.trim(YaRequest.getAlnum('password', '', 'INPUT'));

        if (!loginVal) {

            $('#login').addClass('invalid');
            return;
        }

        if (!passwordVal) {

            $('#password').addClass('invalid');
            return;
        }

        console.log(loginVal);
        Meteor.loginWithPassword(loginVal, passwordVal.toString(), function (error) {

            if (error) {

                showNotice('error', 'Неверный логин или пароль.');
            }

            Router.go('chat');
        });
    }
});
