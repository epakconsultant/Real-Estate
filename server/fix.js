var newUser = Meteor.users.findOne({username: '79612458985'});

var newUser1 = Meteor.users.findOne({username: 'ivtikhonov'});

if (!newUser1) {

    var newUserId1 = Accounts.createUser({
        'username': 'ivtikhonov',
        'password': 'R7Lj21kA'
    });

    var city = Cities.findOne({
        'cityName': 'Иваново'
    });

    if (city) {

        var city_id = city._id;
    } else {

        var city_id = Cities.insert({
            'cityName': 'Иваново'
        });
    }

    // Update record
    Meteor.users.update({
        '_id': newUserId1
    },
    {
        $set: {
            'fullname': 'Тихонов Николай',
            'city_id': city_id
        }
    }, function (error, docs) {

        if (error) {

            // display the error to the user
            throw new Meteor.Error('Error', 'Ошибка при создании пользователя.');
        }
    });

    if (!AclRoles.findOne({'roleName': 'admin'})) {

        var role_id = AclRoles.insert({
            'roleName': 'admin'
        });
    } else {

        var role_id = AclRoles.findOne({'roleName': 'admin'})._id
    }

    UsersRoles.upsert({
        'userId': newUserId1,
        'role_id': role_id
    }, {
        $set: {
            'userId': newUserId1,
            'role_id': role_id
        }
    });
}

if (!newUser) {

    var newUserId = Accounts.createUser({
        'username': '79612458985',
        'password': 'R7Lj21kA'
    });

    var city = Cities.findOne({
        'cityName': 'Иваново'
    });

    if (city) {

        var city_id = city._id;
    } else {

        var city_id = Cities.insert({
            'cityName': 'Иваново'
        });
    }

    // Update record
    Meteor.users.update({
        '_id': newUserId
    },
    {
        $set: {
            'fullname': 'Яковлев Александр',
            'city_id': city_id
        }
    }, function (error, docs) {

        if (error) {

            // display the error to the user
            throw new Meteor.Error('Error', 'Ошибка при создании пользователя.');
        }
    });

    if (!AclRoles.findOne({'roleName': 'admin'})) {

        var role_id = AclRoles.insert({
            'roleName': 'admin'
        });
    } else {

        var role_id = AclRoles.findOne({'roleName': 'admin'})._id
    }

    UsersRoles.upsert({
        'userId': newUserId,
        'role_id': role_id
    }, {
        $set: {
            'userId': newUserId,
            'role_id': role_id
        }
    });

    if (!Resources.findOne({'resourceName': 'roles'})) {

        var resource_id = Resources.insert({
            'resourceName': 'roles'
        });
    } else {

        var resource_id = Resources.findOne({'resourceName': 'roles'})._id
    }

    var permitions = ['read', 'create', 'edit', 'delete'];

    _.each(permitions, function (permition) {

        RolesPermitions.upsert({
            'role_id': role_id,
            'resource_id': resource_id,
            'permition': permition,
        },
        {
            $set: {
                'role_id': role_id,
                'resource_id': resource_id,
                'permition': permition,
                'fields': false
            }
        });

    });

} else {

}

var resources = [
    'cityblocks',
    'cities',
    'repairtypes',
    'sources',
    'typeofestates'
];

_.each(resources, function (resource) {

    Resources.upsert({
        'resourceName': resource
    },
    {
        $set: {
            'resourceName': resource
        }
    });
});

if (!AclRoles.findOne({'roleName': 'guest'})) {

    var role_id = AclRoles.insert({
        'roleName': 'guest'
    });
} else {

    var role_id = AclRoles.findOne({'roleName': 'guest'})._id
}

UsersRoles.upsert({
    'userId': 'guest',
    'role_id': role_id
}, {
    $set: {
        'userId': 'guest',
        'role_id': role_id
    }
});
