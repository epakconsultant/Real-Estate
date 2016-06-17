Meteor.methods({

    'userInsert': function (attributes) {
        
        var loggedInUser,
            city_id,
            city,
            cityName,
            password,
            email,
            entity,
            newUserId;


        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
            
            throw new Meteor.Error(403, "Access denied");
        }


        city_id = YaFilter.clean({
            'source': s(attributes.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({_id: city_id});

        if (!city) {

            // No such city
            throw new Meteor.Error('Error', 'There is no city ' + city_id + ' in database.');
        }

        cityName = city.cityName;


        password = YaFilter.clean({
                'source': s(attributes.password).trim().value(),
                'type': 'AlNum'
            });

        email = YaFilter.clean({
                'source': s(attributes.email).trim().value(),
                'type': 'Mail'
            });

        if (!password || !email) {

            throw new Meteor.Error('Error', 'Incorrect password or email.');
        }


        entity = _.extend({

            'namelast': YaFilter.clean({
                'source': s(attributes.namelast).trim().value(),
                'type': 'String'
            }),

            'namefirst': YaFilter.clean({
                'source': s(attributes.namefirst).trim().value(),
                'type': 'String'
            }),

            'namemiddle': YaFilter.clean({
                'source': s(attributes.namemiddle).trim().value(),
                'type': 'String'
            }),

            'phoneCell': YaFilter.clean({
                'source': attributes.phoneCell,
                'type': 'Number'
            }),

            'phoneHome': YaFilter.clean({
                'source': attributes.phoneHome,
                'type': 'Number'
            }),

            'regAddresszipCode': YaFilter.clean({
                'source': attributes.regAddresszipCode,
                'type': 'Int'
            }),

            'regAddressstreet': YaFilter.clean({
                'source': s(attributes.regAddressstreet).trim().value(),
                'type': 'String'
            }),

            'regAddresshouseNumber': YaFilter.clean({
                'source': s(attributes.regAddresshouseNumber).trim().value(),
                'type': 'String'
            }),

            'regAddresshouseCorp': YaFilter.clean({
                'source': attributes.regAddresshouseCorp,
                'type': 'Int'
            }),

            'regAddressapartment': YaFilter.clean({
                'source': attributes.regAddressapartment,
                'type': 'Int'
            }),

            'realAddresszipCode': YaFilter.clean({
                'source': attributes.realAddresszipCode,
                'type': 'Int'
            }),

            'realAddressstreet': YaFilter.clean({
                'source': s(attributes.realAddressstreet).trim().value(),
                'type': 'String'
            }),

            'realAddresshouseNumber': YaFilter.clean({
                'source': s(attributes.realAddresshouseNumber).trim().value(),
                'type': 'String'
            }),

            'realAddresshouseCorp': YaFilter.clean({
                'source': attributes.realAddresshouseCorp,
                'type': 'Int'
            }),

            'realAddressapartment': YaFilter.clean({
                'source': attributes.realAddressapartment,
                'type': 'Int'
            }),

            'passportseria': YaFilter.clean({
                'source': attributes.passportseria,
                'type': 'Int'
            }),

            'passportid': YaFilter.clean({
                'source': attributes.passportid,
                'type': 'Int'
            }),

            'passportdateOfReceving': YaFilter.clean({
                'source': s(attributes.passportdateOfReceving).trim().value(),
                'type': 'String'
            }),

            'passportwhereReseved': YaFilter.clean({
                'source': s(attributes.passportwhereReseved).trim().value(),
                'type': 'String'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'isAdmin': YaFilter.clean({
                'source': attributes.isAdmin,
                'type': 'Boolean'
            }),

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            })
        },
        {
            'authorUserId': loggedInUser._id,

            'author': loggedInUser.namelast + ' ' + loggedInUser.namefirst + ' ' + loggedInUser.namemiddle,

            'creationDate': new Date()
        });


        if (!entity.namelast) {

            throw new Meteor.Error('Error', 'Incorrect lastname.');
        }

        if (!entity.namefirst) {

            throw new Meteor.Error('Error', 'Incorrect firstname.');
        }



        newUserId = Accounts.createUser({
            'email': email,
            'password': password
        });

        if (!newUserId) {

            throw new Meteor.Error('Error', 'An error have occured during the user creation.');
        }


        isAdmin = YaFilter.clean({
            'source': attributes.isAdmin,
            'type': 'Boolean'
        });

        if (isAdmin) {

            Roles.addUsersToRoles(newUserId, ['admin']);
        }


        check(entity, {

            'namelast': String,

            'namefirst': String,

            'namemiddle': String,

            'phoneCell': Number,

            'phoneHome': Number,

            'regAddresszipCode': Number,

            'regAddressstreet': String,

            'regAddresshouseNumber': String,

            'regAddresshouseCorp': Number,

            'regAddressapartment': Number,

            'realAddresszipCode': Number,

            'realAddressstreet': String,

            'realAddresshouseNumber': String,

            'realAddresshouseCorp': Number,

            'realAddressapartment': Number,

            'passportseria': Number,

            'passportid': Number,

            'passportdateOfReceving': String,

            'passportwhereReseved': String,

            'cityName': String,

            'city_id': String,

            'isAdmin': Boolean,

            'isActive': Boolean,

            'authorUserId': String,

            'author': String,

            'creationDate': Date
        });


        // Update record
        Meteor.users.update({
            '_id': newUserId
        },
        {
            $set: entity
        }, function (error, docs) {

            if (error) {

            // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }
        });


        return {
          '_id': newUserId
        };
    },

    'userUpdate': function (_id, attributes) {
        
        var loggedInUser,
            city_id,
            city,
            cityName,
            password,
            email,
            entity;


        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
            
            throw new Meteor.Error(403, "Access denied");
        }
        

        // Clean _id
        check(_id, String);
        
        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });
        

        city_id = YaFilter.clean({
            'source': s(attributes.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({_id: city_id});

        if (!city) {
            // No such city
            throw new Meteor.Error('Error', 'There is no city ' + city_id + ' in database.');
        }

        cityName = city.cityName;


        password = YaFilter.clean({
            'source': s(attributes.password).trim().value(),
            'type': 'AlNum'
        });

        // TODO - required fields check
        email = YaFilter.clean({
            'source': s(attributes.email).trim().value(),
            'type': 'Mail'
        });



        if (password) {

            Accounts.setPassword(_id, password);
        }

        if (!email) {

            throw new Meteor.Error('Error', 'Incorrect email.');
        }


        entity = _.extend({

            'namelast': YaFilter.clean({
                'source': s(attributes.namelast).trim().value(),
                'type': 'String'
            }),

            'namefirst': YaFilter.clean({
                'source': s(attributes.namefirst).trim().value(),
                'type': 'String'
            }),

            'namemiddle': YaFilter.clean({
                'source': s(attributes.namemiddle).trim().value(),
                'type': 'String'
            }),

            'phoneCell': YaFilter.clean({
                'source': attributes.phoneCell,
                'type': 'Number'
            }),

            'phoneHome': YaFilter.clean({
                'source': attributes.phoneHome,
                'type': 'Number'
            }),

            'regAddresszipCode': YaFilter.clean({
                'source': attributes.regAddresszipCode,
                'type': 'Int'
            }),

            'regAddressstreet': YaFilter.clean({
                'source': s(attributes.regAddressstreet).trim().value(),
                'type': 'String'
            }),

            'regAddresshouseNumber': YaFilter.clean({
                'source': s(attributes.regAddresshouseNumber).trim().value(),
                'type': 'String'
            }),

            'regAddresshouseCorp': YaFilter.clean({
                'source': attributes.regAddresshouseCorp,
                'type': 'Int'
            }),

            'regAddressapartment': YaFilter.clean({
                'source': attributes.regAddressapartment,
                'type': 'Int'
            }),

            'realAddresszipCode': YaFilter.clean({
                'source': attributes.realAddresszipCode,
                'type': 'Int'
            }),

            'realAddressstreet': YaFilter.clean({
                'source': s(attributes.realAddressstreet).trim().value(),
                'type': 'String'
            }),

            'realAddresshouseNumber': YaFilter.clean({
                'source': s(attributes.realAddresshouseNumber).trim().value(),
                'type': 'String'
            }),

            'realAddresshouseCorp': YaFilter.clean({
                'source': attributes.realAddresshouseCorp,
                'type': 'Int'
            }),

            'realAddressapartment': YaFilter.clean({
                'source': attributes.realAddressapartment,
                'type': 'Int'
            }),

            'passportseria': YaFilter.clean({
                'source': attributes.passportseria,
                'type': 'Int'
            }),

            'passportid': YaFilter.clean({
                'source': attributes.passportid,
                'type': 'Int'
            }),

            'passportdateOfReceving': YaFilter.clean({
                'source': s(attributes.passportdateOfReceving).trim().value(),
                'type': 'String'
            }),

            'passportwhereReseved': YaFilter.clean({
                'source': s(attributes.passportwhereReseved).trim().value(),
                'type': 'String'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'isAdmin': YaFilter.clean({
                'source': attributes.isAdmin,
                'type': 'Boolean'
            }),

            'isActive': YaFilter.clean({
                'source': attributes.isActive,
                'type': 'Boolean'
            })
        }, {

        });


        check(entity, {

            'namelast': String,

            'namefirst': String,

            'namemiddle': String,

            'phoneCell': Number,

            'phoneHome': Number,

            'regAddresszipCode': Number,

            'regAddressstreet': String,

            'regAddresshouseNumber': String,

            'regAddresshouseCorp': Number,

            'regAddressapartment': Number,

            'realAddresszipCode': Number,

            'realAddressstreet': String,

            'realAddresshouseNumber': String,

            'realAddresshouseCorp': Number,

            'realAddressapartment': Number,

            'passportseria': Number,

            'passportid': Number,

            'passportdateOfReceving': String,

            'passportwhereReseved': String,

            'cityName': String,

            'city_id': String,

            'isAdmin': Boolean,

            'isActive': Boolean
        });


        entity.emails = [{
            'address': email,
            'verified': true
        }];


        if (!entity.namelast) {

            throw new Meteor.Error('Error', 'Incorrect lastname.');
        }

        if (!entity.namefirst) {

            throw new Meteor.Error('Error', 'Incorrect firstname.');
        }


        // Update record
        Meteor.users.update({
            '_id': _id
        },
        {
            $set: entity
        }, function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }
        });


        isAdmin = YaFilter.clean({
            'source': attributes.isAdmin,
            'type': 'Boolean'
        });

        if (isAdmin) {

            Roles.addUsersToRoles(_id, ['admin']);
        } else {
            
            Roles.removeUsersFromRoles(_id, 'admin');
        }

        return 1;
    },

    'userRemove': function (_id) {

        var loggedInUser;


        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        if (!loggedInUser || !Roles.userIsInRole(loggedInUser, ['admin'])) {
            
            throw new Meteor.Error(403, "Access denied");
        }
        

        // Clean _id
        check(_id, String);
        
        _id = YaFilter.clean({
            'source': s(_id).trim().value(),
            'type': 'AlNum'
        });


        return Meteor.users.remove(_id);
    }
});