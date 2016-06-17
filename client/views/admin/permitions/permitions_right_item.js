Template.resourceRightsItem.helpers({
    'rolesArr': function () {

        var that = this;

        var roles = AclRoles.find().fetch();

        var rolesArr = [];

        _.each(roles, function (role) {

            var permNames = ['list', 'read', 'edit', 'create', 'delete'];

            var permArr =[];

            _.each(permNames, function (permName) {

                var rolePerm = RolesPermitions.findOne({
                    'resource_id': that._id,
                    'permition': permName,
                    'role_id': role._id
                });

                var fields = '';

                var isActive = '';

                if (rolePerm) {

                    if (rolePerm.fields && _.isArray(rolePerm.fields)) {

                        console.log(rolePerm.fields);
                        _.each(rolePerm.fields, function (field, index) {

                            if (index !== 0) {

                                fields += ';';
                            }

                            fields += field.toString();
                        });
                    }

                    isActive = 'checked';
                }

                permArr.push({
                    'permitionName': permName,
                    'permitionId': 'perm-' + permName + '-' + role.roleName + '-' + that.resourceName,
                    'fieldsId': 'fields-' + permName + '-' + role.roleName + '-' + that.resourceName,
                    'fields': fields,
                    'isActive': isActive
                });
            });

            rolesArr.push({
                'roleName': role.roleName,
                'permArr': permArr
            });
        });

        return rolesArr;
    },

    'testP': function () {

        return '<p>test</p>';
    }
});

Template.resourceRightsItem.events({
    'click .save-btn': function (e) {

        e.preventDefault();

        var that = this;

        var permNames = ['list', 'read', 'edit', 'create', 'delete'];

        var entity = {};

        var roles = AclRoles.find().fetch();

        _.each(roles, function (role) {

            entity[role.roleName] = {};

            _.each(permNames, function (permName) {

                var fields = $.trim(YaRequest.getString('fields-' + permName + '-' + role.roleName + '-' + that.resourceName, '', 'INPUT'));

                if (fields) {

                    var fieldsArr = fields.split(';');

                    var fieldsVal = [];

                    _.each(fieldsArr, function (fieldsArrVal) {

                        fieldsVal.push(YaFilter.clean({
                            'source': s(fieldsArrVal).trim().value(),
                            'type': 'Word'
                        }));
                    });
                } else {

                    var fieldsVal = false;
                }

                entity[role.roleName][permName] = {
                    'isAllowed': YaRequest.getBool('perm-' + permName + '-' + role.roleName + '-' + that.resourceName, false, 'SELECT'),
                    'fields':  fieldsVal
                };
            });
        });

        console.log(entity);

        Meteor.call('setPermitions', that.resourceName, entity, function (error, obj) {

            if (error) {

                // display the error to the user
                showNotice('error', error.reason);
                return;
            } else {

                showNotice('note', 'Запись сохранена');
            }
        });
    }
});
