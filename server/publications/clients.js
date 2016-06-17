Meteor.publish('clients', function () {

    if (this.userId) {

        var loggedInUser;

        loggedInUser = Meteor.users.findOne(this.userId);

        if (Roles.userIsInRole(loggedInUser, ['admin','manager'])) {

            return Clients.find({city_id: loggedInUser.city_id}, {

                'sort': {
                    'creationDate': 1
                }
            });
        } else {

            this.ready();
            return [];
        }


    } else {

        this.ready();
        return [];
    }
});


Meteor.publish('clientById', function (id) {

    if (this.userId) {

        var loggedInUser;

        loggedInUser = Meteor.users.findOne(this.userId);

        if (Roles.userIsInRole(loggedInUser, ['admin','manager'])) {

            id = YaFilter.clean({
                source: s(id).trim().value(),
                type: 'AlNum'
            });

            return Clients.find({_id: id, city_id: loggedInUser.city_id}, {

                'sort': {
                    'creationDate': 1
                }
            });
        } else {

            this.ready();
            return [];
        }


    } else {

        this.ready();
        return [];
    }
});

Meteor.publish('clientByUser', function () {

    if (this.userId) {

        var loggedInUser;

        loggedInUser = Meteor.users.findOne(this.userId);

        if (Roles.userIsInRole(loggedInUser, ['client'])) {


            return Clients.find({
                'userAccountId': this.userId,
                 city_id: loggedInUser.city_id
             },
             {

                'sort': {
                    'creationDate': 1
                }
            });
        } else {

            this.ready();
            return [];
        }


    } else {

        this.ready();
        return [];
    }
});

Meteor.publish('clientsList', function (findOptions) {

    var loggedInUser,
        limit,
        clientsStatus,
        searchObj,
        query;


    if (this.userId) {

        var loggedInUser;

        loggedInUser = Meteor.users.findOne(this.userId);

        if (Roles.userIsInRole(loggedInUser, ['admin','manager'])) {


            limit = parseInt(findOptions.limit) || 5;


            clientsStatus = findOptions.clientStatus;

            if (!_.isArray(clientsStatus)) {

                clientsStatus = ['active'];
            }


            _.each(clientsStatus, function (status, index) {

                if (status !== 'active' && status !== 'adv' && status !== 'new' && status !== 'archive') {

                    clientsStatus[index] = 'active';
                }
            });


            clientsStatus = _.uniq(clientsStatus);


            searchObj = {
                'clientStatus': {
                    $in: clientsStatus
                },
                'city_id': loggedInUser.city_id
            };


            query = YaFilter.clean({
                'source': s(findOptions.query).trim().value(),
                'type': 'stringUrl'
            }) || '';

            if (query) {

                searchObj.fullname = {$regex: query, $options: "i"}
            }

            var count = Clients.find(searchObj, {

                'sort': {
                    'modifyDate': 1,
                    'creationDate': -1
                }

            }).fetch().length;

            return Clients.find(searchObj, {

                'sort': {
                    'modifyDate': 1,
                    'creationDate': -1
                },
                'limit': limit
            });
        } else {

            this.ready();
            return [];
        }
    } else {

        this.ready();
        return [];
    }
});
