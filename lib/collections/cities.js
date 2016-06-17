Cities = new Mongo.Collection('cities');

Meteor.methods({

    'cityInsert': function (attributes) {

        var loggedInUser,
            entity,
            entityId;


        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'cities', 'create');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }


        entity = {

            'cityName': YaFilter.clean({
                'source': s(attributes.cityName).trim().value(),
                'type': 'String'
            }),

            'phone': YaFilter.clean({
                'source': s(attributes.phone).trim().value(),
                'type': 'Number'
            }),

            'coordX': YaFilter.clean({
                'source': s(attributes.coordX).trim().value(),
                'type': 'Float'
            }),

            'coordY': YaFilter.clean({
                'source': s(attributes.coordY).trim().value(),
                'type': 'Float'
            }),

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            }),

            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'creationDate': new Date()
        };

        check(entity, {

            'cityName': String,

            'phone': Number,

            'coordX': Number,

            'coordY': Number,

            'isActive': Boolean,

            'userId': String,

            'author': String,

            'creationDate': Date
        });


        var allowedFields = Acl.allowedFields(loggedInUser._id, 'cities', 'create');

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

        entityId = Cities.insert(entity);

        if (Meteor.isServer) {
            EventDispatcher.emit('onCitySave', {
                data: {
                    'isNew': true,
                    'entity': entity
                }
            });
        }

        return {
            _id: entityId
        };
    },

    'cityUpdate': function (_id, attributes) {

        var loggedInUser,
            entity;


        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'cities', 'edit');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permissions denied');
        }



        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        entity = {

            'cityName': YaFilter.clean({
                'source': s(attributes.cityName).trim().value(),
                'type': 'String'
            }),

            'phone': YaFilter.clean({
                'source': s(attributes.phone).trim().value(),
                'type': 'Number'
            }),

            'coordX': YaFilter.clean({
                'source': s(attributes.coordX).trim().value(),
                'type': 'Float'
            }),

            'coordY': YaFilter.clean({
                'source': s(attributes.coordY).trim().value(),
                'type': 'Float'
            }),

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            }),
        };


        check(_id, String);

        check(entity, {

            'cityName': String,

            'phone': Number,

            'coordX': Number,

            'coordY': Number,

            'isActive': Boolean
        });


        var allowedFields = Acl.allowedFields(loggedInUser._id, 'cities', 'edit');

        if (allowedFields && _.isArray(allowedFields)) {

            var newEntity = {};

            _.each(allowedFields, function (allowedField) {

                if (_.has(entity, allowedField)) {

                    newEntity[allowedField] = entity[allowedField];
                }
            });

            entity = newEntity;
        }


        Cities.update({
            '_id': _id
        },
        {
            $set: entity
        },
        function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onCitySave', {
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
