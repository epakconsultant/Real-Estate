Clients = new Mongo.Collection('clients');

Meteor.methods({

    'clientInsert': function (attributes) {
        
        var loggedInUser,
            city_id,
            city,
            cityName,
            entity,
            typeofestate_idsArr,
            typeofestate_ids,
            cityblock_idsArr,
            cityblock_ids,
            entityId,
            tariff_id,
            newAddCost,
            haveErrors = false,
            errors = [];


        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);


        city_id = YaFilter.clean({
            'source': s(loggedInUser.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({_id: city_id});

        if (!city) {

            // No such city
            return {
                'status': 'error',
                'result': 'Города с id ' + city_id + ' не существует.'
            }
        }

        cityName = city.cityName;
        

        entity = {

            'fullname': YaFilter.clean({
                'source': s(attributes.fullname).trim().value(),
                'type': 'String'
            }),

            'phone': YaFilter.clean({
                'source': attributes.phone,
                'type': 'Number'
            }),
            
            'password': YaFilter.clean({
                'source': s(attributes.password).trim().value(),
                'type': 'AlNum'
            }),

            'email': YaFilter.clean({
                'source': s(attributes.email).trim().value(),
                'type': 'Mail'
            }),

            'minPrice': YaFilter.clean({
                'source': attributes.minPrice,
                'type': 'Int'
            }),

            'maxPrice': YaFilter.clean({
                'source': attributes.maxPrice,
                'type': 'Int'
            }),

            'clientStatus': YaFilter.clean({
                'source': s(attributes.clientStatus).trim().value(),
                'type': 'Word'
            }),

            'isInhabited': YaFilter.clean({
                'source': attributes.isInhabited,
                'type': 'Boolean'
            }),
            
            'isInhabitedByUs': YaFilter.clean({
                'source': attributes.isInhabitedByUs,
                'type': 'Boolean'
            }),

            'isProblem': YaFilter.clean({
                'source': attributes.isProblem,
                'type': 'Boolean'
            }),

            'callStatus': YaFilter.clean({
                'source': attributes.callStatus,
                'type': 'Int'
            }),

            'source_id': YaFilter.clean({
                'source': s(attributes.source_id).trim().value(),
                'type': 'AlNum'
            }),

            'notes': YaFilter.clean({
                'source': s(attributes.notes).trim().value(),
                'type': 'String'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'modifyDate': new Date(),

            'creationDate': new Date()
        };


        // If Contract
        /*tariff_id = YaFilter.clean({
            'source': s(attributes.tariff_id).trim().value(),
            'type': 'AlNum'
        });*/


        if (!entity.fullname) {

            errors.push('fullname');
            haveErrors = true;
        }

        if (entity.clientStatus !== 'active' && entity.clientStatus !== 'adv' && entity.clientStatus !== 'archive') {

            errors.push('clientStatus');
            haveErrors = true;
        }

        if (entity.isInhabitedByUs || entity.isInhabited) {

            entity.clientStatus = 'archive';
        }

        /*if (entity.clientStatus === 'active') {

            if (!tariff_id) {

                errors.push('tariff_id');
                haveErrors = true;
            }
        }*/


        if (!entity.maxPrice) {

            entity.maxPrice = 1000000000;
        }

        if (entity.maxPrice < entity.minPrice) {

            entity.maxPrice = 1000000000;
        }

        if (haveErrors) {

            return {

                'status': 'error',
                'result': errors
            }
        }


        check(entity, {

            'fullname': String,

            'phone': Number,

            'password': String,

            'email': String,

            'minPrice': Number,

            'maxPrice': Number,

            'clientStatus': String,

            'isInhabited': Boolean,

            'isInhabitedByUs': Boolean,

            'isProblem': Boolean,

            'callStatus': Number,

            'source_id': String,

            'notes': String,

            'city_id': String,

            'cityName': String,

            'userId': String,

            'author': String,

            'modifyDate': Date,
            
            'creationDate': Date
        });


        typeofestate_idsArr = attributes.typeofestate_ids;

        if (!_.isArray(typeofestate_idsArr)) {

            typeofestate_ids = [];
        } else {

            typeofestate_ids = _.map(typeofestate_idsArr ,function (option) {

                return YaFilter.clean({
                    'source': option,
                    'type': 'AlNum'
                });
            });
        }


        cityblock_idsArr = attributes.cityblock_ids;

        if (!_.isArray(cityblock_idsArr)) {

            cityblock_ids = [];
        } else {

            cityblock_ids = _.map(cityblock_idsArr ,function (option) {

                return YaFilter.clean({
                    'source': option,
                    'type': 'AlNum'
                });
            });
        }

        var notifiersArr = attributes.notifiers;

        if (!_.isArray(notifiersArr)) {

            notifiers = [];
        } else {

            notifiers = _.map(notifiersArr ,function (option) {

                return YaFilter.clean({
                    'source': option,
                    'type': 'AlNum'
                });
            });

            var newNotifiers = [];

            _.each(notifiers, function (element) {

                if (element !== 'sms' && element !== 'email') {

                    return;
                } else {

                    newNotifiers.push(element);
                }
            });
        }

        entity = _.extend(entity, {
            'typeofestate_ids': typeofestate_ids,
            'cityblock_ids': cityblock_ids,
            'notifiers': newNotifiers
        });

        

        // Update record
        entityId = Clients.insert(entity);


        /*newAddCost = YaFilter.clean({
            'source': attributes.newAddCost,
            'type': 'Int'
        });*/


        entity = _.extend(entity, {
            '_id': entityId
            //'newAddCost': newAddCost,
            //'tariff_id': tariff_id
        });


        if (Meteor.isServer) {
            EventDispatcher.emit('onClientSave', {
                data: {
                    'isNew': true,
                    'entity': entity
                }
            });
        }

        return {
            'status': 'note',
            '_id': entityId
        };
    },

    'clientUpdate': function (_id, attributes) {

        var loggedInUser,
            city_id,
            city,
            cityName,
            entity,
            old_entity,
            typeofestate_idsArr,
            typeofestate_ids,
            cityblock_idsArr,
            cityblock_ids,
            tariff_id,
            newAddCost,
            haveErrors = false,
            errors = [];


        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);


        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        city_id = YaFilter.clean({
            'source': s(loggedInUser.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({_id: city_id});

        if (!city) {

            // No such city
            return {
                'status': 'error',
                'result': 'Города с id ' + city_id + ' не существует.'
            }
        }

        cityName = city.cityName;
        

        old_entity = Clients.findOne(_id);


        entity = {

            'fullname': YaFilter.clean({
                'source': s(attributes.fullname).trim().value(),
                'type': 'String'
            }),

            'phone': YaFilter.clean({
                'source': attributes.phone,
                'type': 'Number'
            }),
            
            'password': YaFilter.clean({
                'source': s(attributes.password).trim().value(),
                'type': 'AlNum'
            }),

            'email': YaFilter.clean({
                'source': s(attributes.email).trim().value(),
                'type': 'Mail'
            }),

            'minPrice': YaFilter.clean({
                'source': attributes.minPrice,
                'type': 'Int'
            }),

            'maxPrice': YaFilter.clean({
                'source': attributes.maxPrice,
                'type': 'Int'
            }),

            'clientStatus': YaFilter.clean({
                'source': s(attributes.clientStatus).trim().value(),
                'type': 'Word'
            }),

            'isInhabited': YaFilter.clean({
                'source': attributes.isInhabited,
                'type': 'Boolean'
            }),
            
            'isInhabitedByUs': YaFilter.clean({
                'source': attributes.isInhabitedByUs,
                'type': 'Boolean'
            }),

            'isProblem': YaFilter.clean({
                'source': attributes.isProblem,
                'type': 'Boolean'
            }),

            'callStatus': YaFilter.clean({
                'source': attributes.callStatus,
                'type': 'Int'
            }),

            'source_id': YaFilter.clean({
                'source': s(attributes.source_id).trim().value(),
                'type': 'AlNum'
            }),

            'notes': YaFilter.clean({
                'source': s(attributes.notes).trim().value(),
                'type': 'String'
            }),

            'city_id': city_id,

            'cityName': cityName
        };


        // If Contract
        /*tariff_id = YaFilter.clean({
            'source': s(attributes.tariff_id).trim().value(),
            'type': 'AlNum'
        });*/
        

        if (!entity.fullname) {

            errors.push('fullname');
            haveErrors = true;
        }

        if (entity.clientStatus !== 'active' && entity.clientStatus !== 'adv' && entity.clientStatus !== 'archive') {

            errors.push('clientStatus');
            haveErrors = true;
        }

        if (entity.isInhabitedByUs || entity.isInhabited) {

            entity.clientStatus = 'archive';
        }

        /*if (entity.clientStatus === 'active') {

            if (!tariff_id) {

                errors.push('tariff_id');
                haveErrors = true;
            }
        }*/

        if (!entity.maxPrice) {

            entity.maxPrice = 1000000000;
        }

        if (entity.maxPrice < entity.minPrice) {

            entity.maxPrice = 1000000000;
        }


        if (haveErrors) {

            return {

                'status': 'error',
                'result': errors
            }
        }


        check(entity, {

            'fullname': String,

            'phone': Number,

            'password': String,

            'email': String,

            'minPrice': Number,

            'maxPrice': Number,

            'clientStatus': String,

            'isInhabited': Boolean,

            'isInhabitedByUs': Boolean,

            'isProblem': Boolean,

            'callStatus': Number,

            'source_id': String,

            'notes': String,

            'city_id': String,

            'cityName': String
        });        


        typeofestate_idsArr = attributes.typeofestate_ids;

        if (!_.isArray(typeofestate_idsArr)) {

            typeofestate_ids = [];
        } else {

            typeofestate_ids = _.map(typeofestate_idsArr ,function (option) {

                return YaFilter.clean({
                    'source': option,
                    'type': 'AlNum'
                });
            });
        }


        cityblock_idsArr = attributes.cityblock_ids;

        if (!_.isArray(cityblock_idsArr)) {

            cityblock_ids = [];
        } else {

            cityblock_ids = _.map(cityblock_idsArr ,function (option) {

                return YaFilter.clean({
                    'source': option,
                    'type': 'AlNum'
                });
            });
        }


        var notifiersArr = attributes.notifiers;

        if (!_.isArray(notifiersArr)) {

            notifiers = [];
        } else {

            notifiers = _.map(notifiersArr ,function (option) {

                return YaFilter.clean({
                    'source': option,
                    'type': 'AlNum'
                });
            });

            var newNotifiers = [];

            _.each(notifiers, function (element) {

                if (element !== 'sms' && element !== 'email') {

                    return;
                } else {

                    newNotifiers.push(element);
                }
            });
        }

        entity = _.extend(entity, {
            'typeofestate_ids': typeofestate_ids,
            'cityblock_ids': cityblock_ids,
            'notifiers': newNotifiers
        });


        var dateOfCall = YaFilter.clean({
            'source': s(attributes.dateOfCall).trim().value(),
            'type': 'String'
        });

        

        /*newAddCost = YaFilter.clean({
            'source': attributes.newAddCost,
            'type': 'Int'
        });*/



        // Update record
        Clients.update({_id: _id}, {$set: entity}, function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', 'Ошибка при сохранении.');
            }

            if (Meteor.isServer) {

                entity = _.extend(entity, {
                    '_id': _id
                    /*'newAddCost': newAddCost,
                    'tariff_id': tariff_id*/
                });

                EventDispatcher.emit('onClientSave', {
                    data: {
                        'isNew': false,
                        'entity': entity,
                        'old_entity': old_entity
                    }
                });
            }
        });

        return {
            'status': 'note',
            'result': 1
        };
    },

    'clientUpdateBySelf': function (_id, attributes) {

        var loggedInUser,
            city_id,
            city,
            cityName,
            entity,
            old_entity,
            typeofestate_idsArr,
            typeofestate_ids,
            cityblock_idsArr,
            cityblock_ids,
            tariff_id,
            newAddCost,
            haveErrors = false,
            errors = [];


        loggedInUser = YaUtilities.checkUser(['client']);


        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        var currClient = Clients.findOne(_id);

        if (currClient.userAccountId !== Meteor.userId()) {

            haveErrors = true;
            errors.push('client_id');
        }

        city_id = YaFilter.clean({
            'source': s(loggedInUser.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({_id: city_id});

        if (!city) {

            // No such city
            return {
                'status': 'error',
                'result': 'Города с id ' + city_id + ' не существует.'
            }
        }

        cityName = city.cityName;
        

        old_entity = Clients.findOne(_id);


        entity = {

            'minPrice': YaFilter.clean({
                'source': attributes.minPrice,
                'type': 'Int'
            }),

            'maxPrice': YaFilter.clean({
                'source': attributes.maxPrice,
                'type': 'Int'
            })
        };


        if (!entity.maxPrice) {

            entity.maxPrice = 1000000000;
        }

        if (entity.maxPrice < entity.minPrice) {

            entity.maxPrice = 1000000000;
        }


        if (haveErrors) {

            return {

                'status': 'error',
                'result': errors
            }
        }


        check(entity, {

            'minPrice': Number,

            'maxPrice': Number
        });        


        typeofestate_idsArr = attributes.typeofestate_ids;

        if (!_.isArray(typeofestate_idsArr)) {

            typeofestate_ids = [];
        } else {

            typeofestate_ids = _.map(typeofestate_idsArr ,function (option) {

                return YaFilter.clean({
                    'source': option,
                    'type': 'AlNum'
                });
            });
        }


        cityblock_idsArr = attributes.cityblock_ids;

        if (!_.isArray(cityblock_idsArr)) {

            cityblock_ids = [];
        } else {

            cityblock_ids = _.map(cityblock_idsArr ,function (option) {

                return YaFilter.clean({
                    'source': option,
                    'type': 'AlNum'
                });
            });
        }


        var notifiersArr = attributes.notifiers;

        if (!_.isArray(notifiersArr)) {

            notifiers = [];
        } else {

            notifiers = _.map(notifiersArr ,function (option) {

                return YaFilter.clean({
                    'source': option,
                    'type': 'AlNum'
                });
            });

            var newNotifiers = [];

            _.each(notifiers, function (element) {

                if (element !== 'sms' && element !== 'email') {

                    return;
                } else {

                    newNotifiers.push(element);
                }
            });
        }

        entity = _.extend(entity, {
            'typeofestate_ids': typeofestate_ids,
            'cityblock_ids': cityblock_ids,
            'notifiers': newNotifiers
        });


        /*newAddCost = YaFilter.clean({
            'source': attributes.newAddCost,
            'type': 'Int'
        });*/



        // Update record
        Clients.update({_id: _id}, {$set: entity}, function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', 'Ошибка при сохранении.');
            }

            if (Meteor.isServer) {

                entity = _.extend(entity, {
                    '_id': _id
                    /*'newAddCost': newAddCost,
                    'tariff_id': tariff_id*/
                });

                EventDispatcher.emit('onClientSave', {
                    data: {
                        'isNew': false,
                        'entity': entity, // not all attributes
                        'old_entity': old_entity
                    }
                });
            }
        });

        return {
            'status': 'note',
            'result': 1
        };
    },

    'clientArchive': function (_id) {

        var loggedInUser;


        check(Meteor.userId(), String);


        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);
        

        // Clean _id
        check(_id, String);
        
        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        // Update record
        Clients.update({_id: _id}, {$set: {clientStatus: 'archive'}}, function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }
        });

        return 1;
    },

    'createUserByClientId': function (_id) {

        var loggedInUser;


        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);

        // Clean _id
        check(_id, String);
        
        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        if (Meteor.isServer) {
            EventDispatcher.emit('createUserByClientId', {
                data: {
                    'id': _id
                }
            });
        }

        return {
            'status': 'note',
            'message': 'Аккаунт для пользователя создан.'
        };
    }
});