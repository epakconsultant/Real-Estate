Meteor.methods({

    'roleInsert': function (attributes) {

        var entityId;

        var roleName = YaFilter.clean({
            'source': s(attributes.roleName).trim().value(),
            'type': 'Word'
        });

        entityId = Acl.addRole(roleName);

        return {
            _id: entityId
        };
    },

    'roleRemove': function (roleName) {

        var entityId;

        roleName = YaFilter.clean({
            'source': s(roleName).trim().value(),
            'type': 'Word'
        });

        Acl.removeRole(roleName);

        return {
            'status': 'note',
            'message': 'Роль удалена'
        };
    },

    'resourceInsert': function (attributes) {

        var entityId;

        var resourceName = YaFilter.clean({
            'source': s(attributes.resourceName).trim().value(),
            'type': 'Word'
        });

        entityId = Acl.addResouce(resourceName);

        return {
            _id: entityId
        };
    },

    'resourceRemove': function (resourceName) {

        var entityId;

        resourceName = YaFilter.clean({
            'source': s(resourceName).trim().value(),
            'type': 'Word'
        });

        Acl.removeResource(resourceName);

        return {
            'status': 'note',
            'message': 'Ресурс удален'
        };
    },

    'setPermitions': function (resourceName, attributes) {

        resourceName = YaFilter.clean({
            'source': s(resourceName).trim().value(),
            'type': 'Word'
        });

        var permNames = ['list', 'read', 'edit', 'create', 'delete'];

        var rolesArr = Acl.getAllRoles();

        _.each(rolesArr, function (roleName) {

            _.each(permNames, function (permName) {

                var isAllowed = YaFilter.clean({
                    'source': attributes[roleName][permName].isAllowed,
                    'type': 'Boolean'
                });

                if (isAllowed) {

                    var fields = false;

                    var fieldsArr = attributes[roleName][permName].fields;

                    if (fieldsArr && _.isArray(fieldsArr)) {

                        fields = [];

                        _.each(fieldsArr, function (field) {

                            fields.push(YaFilter.clean({
                                'source': s(field).trim().value(),
                                'type': 'Word'
                            }));
                        });

                        if (!fields.length) {

                            fields =false;
                        }
                    }

                    Acl.allow(roleName, resourceName, permName, fields);
                } else {

                    Acl.removeAllow(roleName, resourceName, permName);
                }
            });
        });

        return {
            'status': 'note',
            'message': 'Изменения сохранены'
        }
    }
});
