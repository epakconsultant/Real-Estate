Repairtypes = new Mongo.Collection('repairtypes');

Meteor.methods({

    'repairtypeInsert': function (attributes) {

        var loggedInUser,
            entity,
            entityId;

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'repairtypes', 'create');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }

        var entity = _.extend({
            'repairTypeName': YaFilter.clean({
                'source': s(attributes.repairTypeName).trim().value(),
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
            'repairTypeName': String,

            'isActive': Boolean,

            'userId': String,

            'author': String,

            'creationDate': Date
        });

        var allowedFields = Acl.allowedFields(loggedInUser._id, 'repairtypes', 'create');

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

        var entityId = Repairtypes.insert(entity);

        if (Meteor.isServer) {
            EventDispatcher.emit('onRepairTypeSave', {
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

    'repairtypeUpdate': function (_id, attributes) {

        var loggedInUser,
            entity;

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'repairtypes', 'edit');

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

            'repairTypeName': YaFilter.clean({
                'source': s(attributes.repairTypeName).trim().value(),
                'type': 'String'
            }),

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            })
        };

        // Clean attributes
        check(entity, {
            'repairTypeName': String,
            'isActive': Boolean
        });

        var allowedFields = Acl.allowedFields(loggedInUser._id, 'repairtypes', 'edit');

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
        Repairtypes.update({_id: _id}, {$set: entity}, function(error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onRepairTypeSave', {
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
