Sources = new Mongo.Collection('sources');

Meteor.methods({

    'sourceInsert': function (attributes) {

        var loggedInUser,
            entity,
            entityId;

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'sources', 'create');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }

        var entity = _.extend({
            'sourceName': YaFilter.clean({
                'source': s(attributes.sourceName).trim().value(),
                'type': 'String'
            }),
            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            })
        }, {
            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'creationDate': new Date()
        });

        check(entity, {
            'sourceName': String,

            'isActive': Boolean,

            'userId': String,

            'author': String,

            'creationDate': Date
        });

        var allowedFields = Acl.allowedFields(loggedInUser._id, 'sources', 'create');

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

        var entityId = Sources.insert(entity);

        if (Meteor.isServer) {
            EventDispatcher.emit('onSourceSave', {
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

    'sourceUpdate': function (_id, attributes) {

        var loggedInUser,
            entity;

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'sources', 'edit');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permissions denied');
        }

        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });

        // Clean _id
        check(_id, String);

        entity = {
            'sourceName': YaFilter.clean({
                'source': s(attributes.sourceName).trim().value(),
                'type': 'String'
            }),
            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            })
        };

        // Clean attributes
        check(entity, {
            'sourceName': String,
            'isActive': Boolean
        });

        var allowedFields = Acl.allowedFields(loggedInUser._id, 'sources', 'edit');

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
        Sources.update({_id: _id}, {$set: entity}, function(error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onSourceSave', {
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
