Template.client.helpers({

    'tariffs': function () {

        var loggedInUser = Meteor.user();

        return Tariffs.find();
    },

    'subscribtions': function () {

        return Subscribtions.find();
    },

    'payments': function () {

        return Payments.find();
    },

    'currUser': function () {

        if (this.userAccountId) {

            return Meteor.users.findOne({
                '_id': this.userAccountId
            });
        } else {

            return null;
        }
        
    },

    'balance': function () {

        var payments = Payments.find().fetch();

        var balance = 0;

        _.each(payments, function (element) {

            balance += element.summ;
        });

        return balance;
    },

    'sources': function () {

        var sources,
            that;


        that = this;


        sources = Sources.find().fetch();        

        _.each(sources, function (value) {

            if (value._id == that.source_id) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return sources;
    },

    'typeofestates': function () {

        var typeofestates,
            that;


        that = this;


        typeofestates = Typeofestates.find().fetch();
        
        _.each(typeofestates, function (value) {

            if (_.indexOf(that.typeofestate_ids, value._id)!== false && _.indexOf(that.typeofestate_ids, value._id) !== -1) {

                _.extend(value, {

                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });
        
        return typeofestates;
    },

    'cityblocks': function () {

        var loggedInUser,
            cityblocks,
            that;


        that = this;


        loggedInUser = Meteor.user();


        cityblocks = CityBlocks.find().fetch();
        
        _.each(cityblocks, function (value) {

            if (_.indexOf(that.cityblock_ids, value._id)!== false && _.indexOf(that.cityblock_ids, value._id) !== -1) {

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

    'currentObjects': function () {

        var searchQuery = ''

        if (this.minPrice) {

            if (searchQuery) {

                searchQuery = searchQuery + '&minPrice=' + encodeURIComponent(+this.minPrice);
            } else {
                searchQuery = 'minPrice=' + encodeURIComponent(+this.minPrice);
            }
        }


        if (this.maxPrice) {

            if (searchQuery) {

                searchQuery = searchQuery + '&maxPrice=' + encodeURIComponent(+this.maxPrice);
            } else {
                searchQuery = 'maxPrice=' + encodeURIComponent(+this.maxPrice);
            }
        }


        if (this.cityblock_ids.length) {

            if (searchQuery) {

                _.each(this.cityblock_ids, function (element) {

                    searchQuery = searchQuery + '&' + encodeURIComponent('cityblock_id[]') + '=' + encodeURIComponent(element);
                });
                
            } else {

                _.each(this.cityblock_ids, function (element, index) {

                    if (index === 0) {

                        searchQuery = encodeURIComponent('cityblock_id[]') + '=' + encodeURIComponent(element);
                    } else {

                        searchQuery = searchQuery + '&' + encodeURIComponent('cityblock_id[]') + '=' + encodeURIComponent(element);
                    }
                });
            }
        }


        if (this.typeofestate_ids.length) {

            if (searchQuery) {

                _.each(this.typeofestate_ids, function (element) {

                    searchQuery = searchQuery + '&' + encodeURIComponent('typeofestate_id[]') + '=' + encodeURIComponent(element);
                });
            } else {

                _.each(this.typeofestate_ids, function (element, index) {

                    if (index === 0) {

                        searchQuery = encodeURIComponent('typeofestate_id[]') + '=' + encodeURIComponent(element);
                    } else {

                        searchQuery = searchQuery + '&' + encodeURIComponent('typeofestate_id[]') + '=' + encodeURIComponent(element);
                    }
                });
            }
        }


        var searchQuerySet = '';

        if (searchQuery) {

            searchQuerySet = '?' + searchQuery;
        }

        return searchQuerySet;
    },

    'ifSms': function () {
        
        if (this.notifiers) {

            var sel = '';
            _.each(this.notifiers, function (element) {

                if (element == 'sms') {
                    sel = 'selected'
                }
            });
        }

        return sel;
    },

    'ifEmail': function () {
        
        if (this.notifiers) {

            var sel = '';
            _.each(this.notifiers, function (element) {

                if (element == 'email') {
                    sel = 'selected'
                }
            });
        }

        return sel;
    },

    'ifInhabited': function () {
        
        if (this.isInhabited) {

            return 'checked';
        }
    },

    'ifInhabitedByUs': function () {
        
        if (this.isInhabitedByUs) {

            return 'checked';
        }
    },

    'ifProblem': function () {
        
        if (this.isProblem) {

            return 'checked';
        }
    },

    'ifActive': function () {
        
        if (this.clientStatus === 'active') {
            
            return 'selected';
        }
    },

    'ifAdv': function () {
        
        if (this.clientStatus === 'adv') {

            return 'selected';
        }
    },

    'ifArchive': function () {
        
        if (this.clientStatus === 'archive') {

            return 'selected';
        }
    },

    'ifOK': function () {
        
        if (this.callStatus == 200) {
            
            return 'selected';
        }
    },

    'ifND': function () {
        
        if (this.callStatus == 500) {

            return 'selected';
        }
    },

    'ifNO': function () {
        
        if (this.callStatus == 404) {

            return 'selected';
        }
    },

    'backUrl': function () {

        var url;

        if (Session.get('clientsUrl')) {

            url = YaFilter.clean({
                'source': s(Session.get('clientsUrl')).trim().value(),
                'type': 'stringurl'
            });

            return url;
        } else {

            return '/clients'
        }
    }
});

Template.client.rendered = function () {

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

    $.datetimepicker.setLocale('ru');

    $('#dateOfCall').datetimepicker({
        i18n:{
            ru:{
                months:[
                    'Январь','Февраль','Март','Апрель',
                    'Май','Июнь','Июль','Август',
                    'Сентабрь','Октябрь','Ноябрь','Декабрь'
                ],
                dayOfWeek:[
                    "Вс", "Пн", "Вт", "Ср", 
                    "Чт", "Пт", "Сб"
                ]
            }
        },
        dayOfWeekStart: 1,
        timepicker:true,
        format:'d.m.Y H:i',
        startDate:'+1971/05/01'
    });
}

Template.client.events({

    'click .save-btn': function (e) {

        var entity,
            entityId,
            haveErrors = false,
            errors = [];

        e.preventDefault();

        $('.invalid').removeClass('invalid');

        entity = {

            'fullname': $.trim(YaRequest.getString('fullname', '', 'INPUT')),

            'phone': $.trim(YaRequest.getNumber('phone', '', 'INPUT')),

            'password': $.trim(YaRequest.getAlnum('password', '', 'INPUT')),

            'email': $.trim(YaRequest.getMail('email', '', 'INPUT')),
           
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

            'notes': $.trim(YaRequest.getString('notes', '', 'INPUT')),

            'dateOfCall': moment($.trim(YaRequest.getString('dateOfCall', '', 'INPUT')), 'DD.MM.YYYY HH:mm').format()
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

        if (entity.clientStatus === 'adv') {

            if (!entity.dateOfCall || !moment(entity.dateOfCall).isValid()) {

                errors.push('dateOfCall');
                haveErrors = true;
            }
        } else {

            entity.dateOfCall = '';
        }

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

        entityId = this._id;

        Meteor.call('clientUpdate', entityId, entity, function (error, result) {

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

                    Router.go('client', {_id: entityId});
                } else if (btnName === 'saveAndCloseBtn') {

                    Router.go('clients');
                } else if (btnName === 'saveAndCreateBtn') {

                    Router.go('clientNew');
                }
            }
        });
    },

    'click #create-user': function (e) {

        Meteor.call('createUserByClientId', this._id, function (error, result) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при пополнении баланса.');
                return;
            } else {

                if (result && result.status == 'error') {

                    showNotice('error', result.message);
                    $(document).scrollTop(0);
                    return;
                }

                showNotice('note', result.message);
                $(document).scrollTop(0);
                return;
            }
        });
    },

    'click #create-checkout': function (e) {

        var sum;

        $('#sum').removeClass('invalid');

        e.preventDefault();

        sum = parseInt($.trim(YaRequest.getInt('sum', '', 'INPUT')));

        if (!sum) {

            $('#sum').addClass('invalid');
            showNotice('error', 'Некорректно заполнены поля.');
            return;
        }

        Meteor.call('addPayment', sum, this._id, function (error, result) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при пополнении баланса.');
                return;
            } else {

                if (result && result.status == 'error') {

                    showNotice('error', result.message);
                    $(document).scrollTop(0);
                    return;
                }

                showNotice('note', result.message);
            }
        });
    },

    'click #create-subscribtion': function (e) {

        var entity,
            entityId,
            haveErrors = false,
            errors = [];

        e.preventDefault();

        entity = {

            'tariff_id': $.trim(YaRequest.getAlnum('tariff_id', '', 'INPUT')),

            'client_id': this._id
        };

        if (!entity.tariff_id) {

            errors.push('tariff_id');
            haveErrors = true;
        }


        if (!entity.client_id) {

            errors.push('tariff_id');
            haveErrors = true;
        }


         if (haveErrors) {

            _.each(errors, function (element) {

                $('#' + element).addClass('invalid');
            });

            showNotice('error', 'Некорректно заполнены поля.'); // ToDo - Add multulanguage support (Yackovlev)

            return;
        }


        Meteor.call('activateSubs', entity, function (error, result) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при создании заказа.');
                return;
            } else {

                if (result && result.status == 'error') {

                    showNotice('error', result.message);
                    $(document).scrollTop(0);
                    return;
                }

                showNotice('note', result.message);
            }
        });
    }
});