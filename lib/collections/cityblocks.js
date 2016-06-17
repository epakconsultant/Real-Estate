CityBlocks = new Mongo.Collection('cityblocks');

Meteor.methods({

    'cityblockInsert': function (attributes) {

        var loggedInUser,
            city_id,
            city,
            cityName,
            entity,
            entityId;


        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'cityblocks', 'create');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }


        city_id = YaFilter.clean({
            'source': s(attributes.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({
            _id: city_id
        },
        {
            'fields': {
                'cityName': 1,
            }
        });

        if (!city) {

            // No such city
            throw new Meteor.Error('Error', 'There is no city ' + city_id + ' in database.');
        }

        cityName = city.cityName;


        entity = {

            'cityBlockName': YaFilter.clean({
                'source': s(attributes.cityBlockName).trim().value(),
                'type': 'String'
            }),

            'cityBlockRoads': YaFilter.clean({
                'source': s(attributes.cityBlockRoads).trim().value(),
                'type': 'String'
            }),

            'cityBlockNumber': YaFilter.clean({
                'source': s(attributes.cityBlockNumber).trim().value(),
                'type': 'Int'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            }),

            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'creationDate': new Date()
        };


        check(entity, {

            'cityBlockName': String,

            'cityBlockRoads': String,

            'cityBlockNumber': Number,

            'city_id': String,

            'cityName': String,

            'isActive': Boolean,

            'userId': String,

            'author': String,

            'creationDate': Date
        });


        var allowedFields = Acl.allowedFields(loggedInUser._id, 'cityblocks', 'create');

        if (allowedFields && _.isArray(allowedFields)) {

            allowedFields = _.union(allowedFields, ['userId', 'author', 'creationDate']);

            var newEntity = {};

            _.each(allowedFields, function (allowedField) {

                if (_.has(entity, allowedField)) {

                    newEntity[allowedField] = entity[allowedField];
                }
            });

            entity = newEntity;
        }

        entityId = CityBlocks.insert(entity);

        if (Meteor.isServer) {
            EventDispatcher.emit('onCityBlockSave', {
                data: {
                    'isNew': true,
                    'entity': entity
                }
            });
        }

        return {
          '_id': entityId
        };
    },

    'cityblockUpdate': function (_id, attributes) {

        var loggedInUser,
            city_id,
            city,
            cityName,
            entity;


        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'cities', 'edit');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }


        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        city_id = YaFilter.clean({
            'source': s(attributes.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({
            _id: city_id
        },
        {
            'fields': {
                'cityName': 1,
            }
        });

        if (!city) {

            // No such city
            throw new Meteor.Error('Error', 'There is no city ' + city_id + ' in database.');
        }

        cityName = city.cityName;


        // Clean _id
        check(_id, String);


        entity = {

            'cityBlockName': YaFilter.clean({
                'source': s(attributes.cityBlockName).trim().value(),
                'type': 'String'
            }),

            'cityBlockRoads': YaFilter.clean({
                'source': s(attributes.cityBlockRoads).trim().value(),
                'type': 'String'
            }),

            'cityBlockNumber': YaFilter.clean({
                'source': s(attributes.cityBlockNumber).trim().value(),
                'type': 'Int'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            })
        };


        // Clean attributes
        check(entity, {

          'cityBlockName': String,

          'cityBlockRoads': String,

          'cityBlockNumber': Number,

          'city_id': String,

          'cityName': String,

          'isActive': Boolean
        });


        var allowedFields = Acl.allowedFields(loggedInUser._id, 'cityblocks', 'edit');

        if (allowedFields && _.isArray(allowedFields)) {

            var newEntity = {};

            _.each(allowedFields, function (allowedField) {

                if (_.has(entity, allowedField)) {

                    newEntity[allowedField] = entity[allowedField];
                }
            });

            entity = newEntity;
        }

        // Update record
        CityBlocks.update({'_id': _id}, {$set: entity}, function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onCityBlockSave', {
                    data: {
                        'isNew': false,
                        'entity': entity
                    }
                });
            }
        });

        return 1;
    }
});
