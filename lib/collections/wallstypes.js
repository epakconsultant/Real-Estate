Wallstypes = new Mongo.Collection('wallstypes');

Meteor.methods({

    'wallstypeInsert': function (attributes) {

        var loggedInUser,
            entity,
            entityId;

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'wallstypes', 'create');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }

        var entity = _.extend({
            'wallsTypeName': YaFilter.clean({
                'source': s(attributes.wallsTypeName).trim().value(),
                'type': 'String'
            }),
            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                type: 'Boolean'
            })
        }, {
            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'creationDate': new Date()
        });

        check(entity, {
            'wallsTypeName': String,

            'isActive': Boolean,

            'userId': String,

            'author': String,

            'creationDate': Date
        });

        var allowedFields = Acl.allowedFields(loggedInUser._id, 'wallstypes', 'create');

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

        var entityId = Wallstypes.insert(entity);

        if (Meteor.isServer) {
            EventDispatcher.emit('onWallsTypeSave', {
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

    'wallstypeUpdate': function (_id, attributes) {

        var loggedInUser,
            entity;

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'wallstypes', 'edit');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permissions denied');
        }

        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });

        // Clean _id
        check(_id, String);

        var entity = {

            'wallsTypeName': YaFilter.clean({
                'source': s(attributes.wallsTypeName).trim().value(),
                'type': 'String'
            }),

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            })
        };

        // Clean attributes
        check(entity, {
            'wallsTypeName': String,
            'isActive': Boolean
        });

        var allowedFields = Acl.allowedFields(loggedInUser._id, 'wallstypes', 'edit');

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
        Wallstypes.update({_id: _id}, {$set: entity}, function(error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onWallsTypeSave', {
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
