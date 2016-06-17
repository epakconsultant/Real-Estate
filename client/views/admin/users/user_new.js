Template.userNew.events({

    'click #saveBtn': function (e) {

        var entity;

        e.preventDefault();

        entity = {
            
            'namelast': $.trim(YaRequest.getString('namelast', '', 'INPUT')),

            'namefirst': $.trim(YaRequest.getString('namefirst', '', 'INPUT')),

            'namemiddle': $.trim(YaRequest.getString('namemiddle', '', 'INPUT')),

            'email': $.trim(YaRequest.getMail('email', '', 'INPUT')),

            'password': $.trim(YaRequest.getAlnum('password', '', 'INPUT')),

            'phoneCell': $.trim(YaRequest.getNumber('phoneCell', '', 'INPUT')),

            'phoneHome': $.trim(YaRequest.getNumber('phoneHome', '', 'INPUT')),

            'regAddresszipCode': $.trim(YaRequest.getInt('regAddresszipCode', '', 'INPUT')),

            'regAddressstreet': $.trim(YaRequest.getString('regAddressstreet', '', 'INPUT')),

            'regAddresshouseNumber': $.trim(YaRequest.getString('regAddresshouseNumber', '', 'INPUT')),

            'regAddresshouseCorp': $.trim(YaRequest.getInt('regAddresshouseCorp', '', 'INPUT')),

            'regAddressapartment': $.trim(YaRequest.getInt('regAddressapartment', '', 'INPUT')),

            'realAddresszipCode': $.trim(YaRequest.getInt('realAddresszipCode', '', 'INPUT')),

            'realAddressstreet': $.trim(YaRequest.getString('realAddressstreet', '', 'INPUT')),

            'realAddresshouseNumber': $.trim(YaRequest.getString('realAddresshouseNumber', '', 'INPUT')),

            'realAddresshouseCorp': $.trim(YaRequest.getInt('realAddresshouseCorp', '', 'INPUT')),

            'realAddressapartment': $.trim(YaRequest.getInt('realAddressapartment', '', 'INPUT')),

            'passportseria': $.trim(YaRequest.getInt('passportseria', '', 'INPUT')),

            'passportid': $.trim(YaRequest.getInt('passportid', '', 'INPUT')),

            'passportdateOfReceving': $.trim(YaRequest.getString('passportdateOfReceving', '', 'INPUT')),

            'passportwhereReseved': $.trim(YaRequest.getString('passportwhereReseved', '', 'INPUT')),

            'city_id': $.trim(YaRequest.getAlnum('city_id', '', 'INPUT')),

            'isAdmin': YaRequest.getBool('isAdmin', false, 'SELECT'),

            'isActive': YaRequest.getBool('isActive', true, 'SELECT')
        };                


        if (!entity.namelast) {

            $('#namelast').addClass('invalid');
            return;
        }

        if (!entity.namefirst) {

            $('#namefirst').addClass('invalid');
            return;
        }

        if (!entity.email) {

            $('#email').addClass('invalid');
            return;
        }

        if (!entity.password) {

            $('#password').addClass('invalid');
            return;
        }

        if (!entity.city_id) {

            $('#city_id').addClass('invalid');
            return;
        }
        

        Meteor.call('userInsert', entity, function (error, result) {

            if (error) {

                // display the error to the user
                alert(error.reason);
            } else {

                alert('Пользователь сохранен')
                Router.go('user', {_id: result._id});
            }
        });
    }
});