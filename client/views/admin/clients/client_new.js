Template.clientNew.helpers({

    'tariffs': function () {

        var loggedInUser = Meteor.user();

        return Tariffs.find();
    },

    'sources': function () {

        return Sources.find();
    },

    'typeofestates': function () {

        return Typeofestates.find();
    },

    'cityblocks': function () {

        var loggedInUser = Meteor.user();

        return CityBlocks.find();
    }
});

Template.clientNew.rendered = function () {

    $('#typeofestate_ids').select2({
        'placeholder': "Типы недвижимости",
        'allowClear': true
    });

    $('#cityblock_ids').select2({
        'placeholder': "Районы города",
        'allowClear': true
    });

    $('#notifiers').select2({
        'placeholder': "Типы уведомлений",
        'allowClear': true
    });
}


Template.clientNew.events({

    'click .save-btn': function (e) {


        var entity,
            haveErrors = false,
            errors = [];


        e.preventDefault();

        $('.invalid').removeClass('invalid');
        
        entity = {
            
            'fullname': $.trim(YaRequest.getString('fullname', '', 'INPUT')),

            'phone': $.trim(YaRequest.getNumber('phone', '', 'INPUT')),

            'password': $.trim(YaRequest.getAlnum('password', '', 'INPUT')),

            'email': $.trim(YaRequest.getMail('email', '', 'INPUT')),

            //'tariff_id': $.trim(YaRequest.getAlnum('tariff_id', '', 'INPUT')),

            //'newAddCost': $.trim(YaRequest.getInt('newAddCost', '', 'INPUT')),
           
            'typeofestate_ids': YaRequest.getArray('typeofestate_ids', '', 'INPUT'),

            'cityblock_ids': YaRequest.getArray('cityblock_ids', '', 'INPUT'),

            'minPrice': $.trim(YaRequest.getInt('minPrice', '', 'INPUT')),

            'maxPrice': $.trim(YaRequest.getInt('maxPrice', '', 'INPUT')),

            'notifiers': YaRequest.getArray('notifiers', '', 'INPUT'),
            
            'clientStatus': YaRequest.getWord('clientStatus', false, 'INPUT'),

            'isInhabited': YaRequest.getBool('isInhabited', false, 'SELECT'),

            'isInhabitedByUs': YaRequest.getBool('isInhabitedByUs', false, 'SELECT'),

            'isProblem': YaRequest.getBool('isProblem', false, 'SELECT'),

            'callStatus': $.trim(YaRequest.getInt('callStatus', '', 'INPUT')),

            'source_id': $.trim(YaRequest.getAlnum('source_id', '', 'INPUT')),

            'notes': $.trim(YaRequest.getString('notes', '', 'INPUT'))
        };                


        if (!entity.fullname) {

            errors.push('fullname');
            haveErrors = true;
        }

        if (!(+entity.phone)) {

            errors.push('phone');
            haveErrors = true;
        }

        entity.phone = YaUtilities.toMobile(entity.phone);

        if (!YaUtilities.checkMobile(entity.phone)) {

            errors.push('phone');
            haveErrors = true;
        }


        if (!(+entity.callStatus)) {

            errors.push('callStatus');
            haveErrors = true;
        }

        if (!entity.clientStatus) {

            errors.push('clientStatus');
            haveErrors = true;
        }

        if (entity.isInhabitedByUs || entity.isInhabited) {

            entity.clientStatus = 'archive';
        }

        /*if (entity.clientStatus === 'active') {

            if (!entity.tariff_id) {

                errors.push('tariff_id');
                haveErrors = true;
            }
        }*/

        if (!entity.source_id) {

            errors.push('source_id');
            haveErrors = true;
        }


        if (haveErrors) {

            _.each(errors, function (element) {

                $('#' + element).addClass('invalid');
            });

            showNotice('error', 'Некорректно заполнены поля.'); // ToDo - Add multulanguage support (Yackovlev)

            return;
        }

        var btnName = $(e.target).attr('id');

        Meteor.call('checkPhone', entity.phone, function (error, obj) {


            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при сохранении.');
                return;
            } else {

                
                if (obj && obj.obj) {

                    if (obj.type === 'blacklist') {

                        showNotice('error', 'Номер ' + obj.obj.phone + ' находится в черном списке.');
                        return;
                    } else if (obj.type === 'client') {

                        showNotice('error', 'Клиент с номером ' + obj.obj.phone + ' уже существует.');
                        return;
                    } else if (obj.type === 'object') {

                        showNotice('error', 'ОБЪЕКТ с таким номером телефона уже существует: ' + obj.obj.owner + ' ул.' + obj.obj.street + ', д.' + obj.obj.houseNumber + '.');
                        return;
                    }
                } else {

                    Meteor.call('clientInsert', entity, function (error, result) {

                        if (error) {

                            // display the error to the user
                            showNotice('error', 'Ошибка при сохранении.');
                            return;
                        } else {

                            if (result && result.status == 'error') {

                                showNotice('error', 'Ошибка при сохранении.');
                                return;
                            }

                            showNotice('note', 'Запись сохранена');

                            if (btnName === 'saveBtn') {

                                Router.go('client', {_id: result._id});
                            } else if (btnName === 'saveAndCloseBtn') {

                                Router.go('clients');
                            } else if (btnName === 'saveAndCreateBtn') {

                                Router.go('clientNew');
                            }
                        }
                    });
                }
            }
        });
    },
    
    'click #sendFirstSms': function (e) {

        e.preventDefault();

        var phone = $.trim(YaRequest.getNumber('phone', '', 'INPUT'));

        if (!(+phone)) {

            $('#phone').addClass('invalid');
            return;
        }

        phone = YaUtilities.toMobile(phone);

        if (!YaUtilities.checkMobile(phone)) {

            $('#phone').addClass('invalid');
            return;
        }

        Meteor.call('sendFirstSms', phone, function (error, result) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при отправке СМС.');
                return;
            } else {

                if (result && result.status == 'error') {

                    showNotice('error', 'Ошибка при отправке СМС.');
                    return;
                }

                showNotice('note', 'Пригласительная СМС отправлена.');
            }
        });
    }/*,

    'click #addCostBtn': function (e) {

        var addCost,
            addedCost;

        e.preventDefault();

        addCost = parseInt($.trim(YaRequest.getInt('addCost', '', 'INPUT')));

        addedCost = parseInt($.trim(YaRequest.getInt('addedCost', '', 'INPUT')));

        addedCost = addedCost + addCost;

        $('#addedCost').val(addedCost);

        var newAddCost = parseInt($.trim(YaRequest.getInt('newAddCost', '', 'INPUT')));

        $('#newAddCost').val(newAddCost + addCost);
    }*/
});