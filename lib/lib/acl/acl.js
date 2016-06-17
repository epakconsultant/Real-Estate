//Permitions = new Mongo.Collection('permitions');
AclRoles = new Mongo.Collection('aclroles'); // published
Resources = new Mongo.Collection('resources'); // published
RolesPermitions = new Mongo.Collection('rolespermitions');
UsersRoles = new Mongo.Collection('usersroles'); // published

YaAcl = function () {

};

YaAcl.prototype.addUserRoles = function (userId, role /* String or Array */) {

    var that = this;

    this.checkCurrentUserPermitions();

    userId = this.clearUserId(userId);

    role = this.clearWords(role);

    if (!userId || !role) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    if (!this.isUserExists(userId)) {

        throw new Meteor.Error('empty-user', 'Пользователя с переданным userId не существует');
    }

    var roles_id = [];

    _.each(role, function (roleName) {

        var role_id = that.isRoleExists(roleName);

        if (!role_id) {

            //throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            roles_id.push(role_id)
        }
    });

    _.each(roles_id, function (role_id) {

        UsersRoles.upsert({
            'userId': userId,
            'role_id': role_id
        }, {
            $set: {
                'userId': userId,
                'role_id': role_id
            }
        });
    });

    return this;
};

YaAcl.prototype.removeUserRoles = function (userId, role /* String or Array */) {

    var that = this;

    this.checkCurrentUserPermitions();

    userId = this.clearUserId(userId);
    role = this.clearWords(role);

    if (!userId || !role) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    if (!this.isUserExists(userId)) {

        throw new Meteor.Error('empty-user', 'Пользователя с переданным userId не существует');
    }

    var roles_id = [];

    _.each(role, function (roleName) {

        var role_id = that.isRoleExists(roleName);

        if (!role_id) {

            //throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            roles_id.push(role_id)
        }
    });

    _.each(roles_id, function (role_id) {

        UsersRoles.upsert({
            'userId': userId,
            'role_id': role_id
        },
        {
            $set: {
                'userId': userId,
                'role_id': role_id
            }
        });
    });

    return this;
};

YaAcl.prototype.userRoles = function (userId) {

    var that = this;

    var userRolesIds = this.userRolesIds(userId);

    var rolesNames = AclRoles.find({
        '_id': {
            $in: userRolesIds
        }
    }).fetch();

    rolesNames = _.pluck(rolesNames, 'roleName');
    rolesNames = _.uniq(rolesNames);

    return rolesNames;
};

YaAcl.prototype.userRolesIds = function (userId) {

    var that = this;

    userId = this.clearUserId(userId);

    if (!userId && userId !== null) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    } else if (userId === null) {

        userId = 'guest'
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

    return userRolesIds;
};

YaAcl.prototype.roleUsers = function (role /* String or Array */) {

    var that = this;

    role = this.clearWords(role);

    if (!role) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var roles_id = [];

    _.each(role, function (roleName) {

        var role_id = that.isRoleExists(roleName);

        if (!role_id) {

            //throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            roles_id.push(role_id)
        }
    });

    var userIds = UsersRoles.find({
        'role_id': {
            $in: roles_id
        }
    },
    {
        'fileds': {
            'userId': 1
        }
    }).fetch();

    userIds = _.pluck(userIds, 'userId');
    userIds = _.uniq(userIds);

    if (userIds.length) {

        return userIds;
    } else {

        return false;
    }
};

YaAcl.prototype.hasRole = function (userId, roleName) {

    var that = this;

    userId = this.clearUserId(userId);

    if (!userId) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    roleName = YaFilter.clean({
        'source': s(roleName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!roleName) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var role_id = that.isRoleExists(roleName);

    if (!role_id) {

        //throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        return false;
    } else {

        var user = UsersRoles.findOne({
            'userId': userId,
            'role_id': role_id
        });

        if (user) {

            return true;
        } else {

            return false;
        }
    }
};

YaAcl.prototype.addRole = function (roleName) {

    var that = this;

    this.checkCurrentUserPermitions();

    roleName = YaFilter.clean({
        'source': s(roleName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!roleName) {

        throw new Meteor.Error('empty-params', 'roleName не передан в метод');
    }

    var role_id = that.isRoleExists(roleName);

    if (!role_id) {

        return AclRoles.insert({
            'roleName': roleName
        });
    }

    return role_id;
};

YaAcl.prototype.removeRole = function (roleName) {

    var that = this;

    this.checkCurrentUserPermitions();

    roleName = YaFilter.clean({
        'source': s(roleName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!roleName) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var role_id = that.isRoleExists(roleName);

    if (role_id) {

        AclRoles.remove({
            'roleName': roleName
        });
    }

    return this;
};

YaAcl.prototype.addResouce = function (resourceName) {

    var that = this;

    this.checkCurrentUserPermitions();

    resourceName = YaFilter.clean({
        'source': s(resourceName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!resourceName) {

        throw new Meteor.Error('empty-params', 'resourceName не передан в метод');
    }

    var resource_id = that.isResourceExists(resourceName);

    if (!resource_id) {

        Resources.insert({
            'resourceName': resourceName
        });
    }

    return this;
};

YaAcl.prototype.removeResource = function (resourceName) {

    var that = this;

    this.checkCurrentUserPermitions();

    resourceName = YaFilter.clean({
        'source': s(resourceName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!resourceName) {

        throw new Meteor.Error('empty-params', 'resourceName не передан в метод');
    }

    var resource_id = that.isResourceExists(resourceName);

    if (resource_id) {

        Resources.remove({
            'resourceName': resourceName
        });
    }

    return this;
};

YaAcl.prototype.allow = function (roles, resources, permitions, fields) {

    var that = this;

    this.checkCurrentUserPermitions();

    roles = this.clearWords(roles);
    resources = this.clearWords(resources);
    permitions = this.clearWords(permitions);
    fields = this.clearFields(fields);

    if (!roles || !resources || !permitions) {

        throw new Meteor.Error('empty-params', 'Не все параметры переданы в метод');
    }

    var roles_id = [];

    _.each(roles, function (roleName) {

        var role_id = that.isRoleExists(roleName);

        if (!role_id) {

            //throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            roles_id.push(role_id)
        }
    });

    var resources_id = [];

    _.each(resources, function (resourceName) {

        var resource_id = that.isResourceExists(resourceName);

        if (!resource_id) {

            //throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            resources_id.push(resource_id)
        }
    });

    _.each(roles_id, function (role_id) {

        _.each(resources_id, function (resource_id) {

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
                        'fields': fields
                    }
                });

            });
        });
    });

    return this;
};

YaAcl.prototype.removeAllow = function (role, resources, permitions) {

    var that = this;

    this.checkCurrentUserPermitions();

    role = YaFilter.clean({
        'source': s(role.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    var role_id = this.isRoleExists(role);

    if (!role_id) {

        //throw new Meteor.Error('empty-role', 'В БД не существует указанной роли.');
        return this;
    }

    resources = this.clearWords(resources);
    permitions = this.clearWords(permitions);

    var resources_id = [];

    _.each(resources, function (resource) {

        var resource_id = that.isResourceExists(resource);

        if (resource_id) {

            resources_id.push(resource_id);
        } else {

            //throw new Meteor.Error('empty-resource', 'В БД не существует указанного ресурса.');
        }
    });

    _.each(resources_id, function (resource_id) {

        _.each(permitions, function (permition) {

            RolesPermitions.remove({
                'role_id': role_id,
                'resource_id': resource_id,
                'permition': permition
            });
        });
    });

    return this;
};

YaAcl.prototype.allowedPermitions = function (userId, resources /* String or Array */) {

    var that = this;

    userId = this.isUserExists(userId);

    resources = this.clearWords(resources);

    var resources_id = [];

    _.each(resources, function (resource) {

        var resource_id = that.isResourceExists(resource);

        if (resource_id) {

            resources_id.push(resource_id);
        } else {

            //throw new Meteor.Error('empty-resource', 'В БД не существует указанного ресурса.');
        }
    });

    var userRolesIds = this.userRolesIds(userId);
    if (userRolesIds.length) {

        var allowedPermitions = [];

        _.each(resources_id, function (resource_id, index) {

            var rolesPermitions = RolesPermitions.find({
                'role_id': {
                    $in: userRolesIds
                },
                'resource_id': resource_id
            },
            {
                'fields': {
                    'permition': 1
                }
            }).fetch();

            rolesPermitions = _.pluck(rolesPermitions, 'permition');
            rolesPermitions = _.uniq(rolesPermitions);

            allowedPermitions[resources[index]] = rolesPermitions;
        });

        return allowedPermitions;
    } else {

        return false;
    }
};

YaAcl.prototype.isAllowed = function (userId, resource, permitions) {

    var that = this;

    resource = YaFilter.clean({
        'source': s(resource.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    permitions = this.clearWords(permitions);

    var allowedPermitions = this.allowedPermitions(userId, resource);


    if (_.isArray(allowedPermitions[resource])) {

        var permitionsIntersect = _.intersection(permitions, allowedPermitions[resource]);

        if (permitionsIntersect.length === permitions.length) {

            return true;
        } else {

            return false;
        }
    } else {

        return false;
    }
};

YaAcl.prototype.allowedFields = function (userId, resource, permition) {

    userId = this.isUserExists(userId);

    resource = YaFilter.clean({
        'source': s(resource.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    permition = YaFilter.clean({
        'source': s(permition.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    var userRolesIds = this.userRolesIds(userId);
    if (userRolesIds.length) {

        var allowedFields = false;
        var resource_id = this.isResourceExists(resource);

        if (resource_id) {

            if (_.indexOf(['read', 'list', 'edit', 'create', 'delete'], permition) !== -1) {

                allowedFields = [];

                var rolesFields = RolesPermitions.find({
                    'role_id': {
                        $in: userRolesIds
                    },
                    'resource_id': resource_id,
                    'permition': permition
                },
                {
                    'fields': {
                        'fields': 1
                    }
                }).fetch();

                rolesFields = _.pluck(rolesFields, 'fields');

                if (rolesFields && _.isArray(rolesFields)) {

                    _.each(rolesFields, function (rolesFieldArr) {

                        if (rolesFieldArr && _.isArray(rolesFieldArr)) {

                            allowedFields = _.union(allowedFields, rolesFieldArr);
                        }
                    });

                    allowedFields = _.uniq(allowedFields);

                    allowedFields = _.without(allowedFields, false);

                    if (!allowedFields.length) {

                        allowedFields = false;
                    }
                } else {

                    allowedFields = false;
                }
            }
        }

        return allowedFields;
    } else {

        return false;
    }
};

YaAcl.prototype.getAllRoles = function () {

    var that = this;

    var allRoles = AclRoles.find().fetch();

    allRoles = _.pluck(allRoles, 'roleName');
    allRoles = _.uniq(allRoles);

    return allRoles;
};

YaAcl.prototype.getAllRolesIds = function () {

    var that = this;

    var allRoles = AclRoles.find().fetch();

    allRoles = _.pluck(allRoles, '_id');
    allRoles = _.uniq(allRoles);

    return allRoles;
};

YaAcl.prototype.userIsInRole = function (userId, roleName) {
    // To do
};

YaAcl.prototype.areAnyRolesAllowed = function (roles, resource, permitions) {
    // To do
};

YaAcl.prototype.whatResources = function (roles) {

    var that = this;

    roles = this.clearWords(roles);

    var role_ids = [];

    _.each(roles, function (roleName) {

        var role_id = that.isRoleExists(roleName);

        if (!role_id) {

            //throw new Meteor.Error('non-existing-role', 'Роли' + roleName + ' не существует в БД');
        } else {

            role_ids.push(role_id);
        }
    });

    var resourcesList = RolesPermitions.find({
        'role_id': {
            $in: role_ids
        }
    }).fetch();

    resourcesList = _.pluck(resourcesList, 'resource_id');
    resourcesList = _.uniq(resourcesList);

    return resourcesList;
};

// Private
YaAcl.prototype.clearWords = function (role) {

    var that = this;

    // Clean Roles
    if (role) {

        if (_.isArray(role)) {

            _.each(role, function (element, index) {

                role[index] = YaFilter.clean({
                    'source': s(element.toString().toLowerCase()).trim().value(),
                    'type': 'Word'
                });

            });
        } else {

            role = YaFilter.clean({
                'source': s(role.toString().toLowerCase()).trim().value(),
                'type': 'Word'
            });

            role = [role];
        }

        return role;
    } else {

        return false
    }
};

YaAcl.prototype.clearFields = function (role) {

    var that = this;

    // Clean Roles
    if (role) {

        if (_.isArray(role)) {

            _.each(role, function (element, index) {

                role[index] = YaFilter.clean({
                    'source': s(element.toString()).trim().value(),
                    'type': 'Word'
                });

            });
        } else {

            role = YaFilter.clean({
                'source': s(role.toString()).trim().value(),
                'type': 'Word'
            });

            role = [role];
        }

        return role;
    } else {

        return false
    }
};

YaAcl.prototype.clearUserId = function (userId) {

    var that = this;

    if (userId) {
        // Clean userId
        userId = YaFilter.clean({
            'source': s(userId.toString()).trim().value(),
            'type': 'AlNum'
        });

        check(userId, String);

        if (!userId) {

            return null;
        } else {

            return userId;
        }
    } else {

        return null;
    }
};

YaAcl.prototype.isRoleExists = function (roleName) {

    var that = this;

    roleName = YaFilter.clean({
        'source': s(roleName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!roleName) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var existedRole = AclRoles.findOne({'roleName': roleName});

    if (existedRole) {

        return existedRole._id;
    } else {

        return false;
    }
};

YaAcl.prototype.isResourceExists = function (resourceName) {

    var that = this;

    resourceName = YaFilter.clean({
        'source': s(resourceName.toString().toLowerCase()).trim().value(),
        'type': 'Word'
    });

    if (!resourceName) {

        throw new Meteor.Error('empty-params', 'userId или role не переданы в метод');
    }

    var existedResource = Resources.findOne({'resourceName': resourceName});

    if (existedResource) {

        return existedResource._id;
    } else {

        return false;
    }
};

YaAcl.prototype.isUserExists = function (userId) {

    var that = this;

    userId = this.clearUserId(userId);

    if (userId !== null) {


        if (!userId) {

            return false;
        }

        if (Meteor.users.findOne({_id: userId})) {

            return userId;
        } else {

            return null;
        }
    } else {

        return null;
    }
};

YaAcl.prototype.checkCurrentUserPermitions = function () {

    var that = this;

    var currentUserId = this.clearUserId(that.getCurrentUserId());

    if (!this.isAllowed(currentUserId, 'roles', ['read', 'create', 'edit', 'delete'])) {

        throw new Meteor.Error('have-no-permitions', 'У Вас нет прав на совершение дествия');
    }

    return true;
}

YaAcl.prototype.getCurrentUserId = function () {

    return Meteor.userId();
}

Acl = new YaAcl();
