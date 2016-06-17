// User AclRoles
Meteor.publish(null, function () {

    if (this.userId) {

        var userId = YaFilter.clean({
            source: s(this.userId).trim().value(),
            type: 'AlNum'
        });

        var userRolesIds = UsersRoles.find({
            'userId': userId
        },
        {
            'fields': {
                'role_id': 1
            }
        }).fetch();

        userRolesIds = _.pluck(userRolesIds, 'role_id');
        userRolesIds = _.uniq(userRolesIds);

        return AclRoles.find({
            '_id': {
                $in: userRolesIds
            }
        });
    } else {

        // User is not authorized
        return AclRoles.find({
            'roleName': 'guest'
        });
    }
});

// User Roles
Meteor.publish(null, function () {

    if (this.userId) {

        var userId = YaFilter.clean({
            source: s(this.userId).trim().value(),
            type: 'AlNum'
        });

        return UsersRoles.find({
            'userId': userId
        });
    } else {

        return UsersRoles.find({
            'userId': 'guest'
        });
    }
});

// User Resources
Meteor.publish(null, function () {

    if (this.userId) {

        var userId = YaFilter.clean({
            source: s(this.userId).trim().value(),
            type: 'AlNum'
        });
    } else {

        var userId = 'guest';
    }

    var userRolesIds = UsersRoles.find({
        'userId': userId
    },
    {
        'fields': {
            'role_id': 1
        }
    }).fetch();

    userRolesIds = _.pluck(userRolesIds, 'role_id');
    userRolesIds = _.uniq(userRolesIds);

    var resourcesList = RolesPermitions.find({
        'role_id': {
            $in: userRolesIds
        }
    }).fetch();

    resourcesList = _.pluck(resourcesList, 'resource_id');
    resourcesList = _.uniq(resourcesList);

    return Resources.find({
        '_id': {
            $in: resourcesList
        }
    });
});

// Roles Permitions
Meteor.publish(null, function () {

    if (this.userId) {

        var userId = YaFilter.clean({
            source: s(this.userId).trim().value(),
            type: 'AlNum'
        });
    } else {

        var userId = 'guest';
    }

    var userRolesIds = UsersRoles.find({
        'userId': userId
    },
    {
        'fields': {
            'role_id': 1
        }
    }).fetch();

    userRolesIds = _.pluck(userRolesIds, 'role_id');
    userRolesIds = _.uniq(userRolesIds);

    return RolesPermitions.find({
        'role_id': {
            $in: userRolesIds
        }
    });
});
