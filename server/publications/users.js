Meteor.publish(null, function() {

    if (this.userId) {

            return Meteor.users.find({_id: this.userId}, {

                'fields': {
                    'fullname': 1,
                    'city_id': 1,
                    'cityName': 1
                }
            });
    } else {

        this.ready();
        return [];
    }
});

Meteor.publish('users', function () {

    if (this.userId) {

        if (Roles.userIsInRole(this.userId, ['admin'])) {


            return Meteor.users.find({}, {

                'fields': {
                    'services': 1,
                    'namelast': true,
                    'namefirst': 1,
                    'namemiddle': 1,
                    'phoneCell': 1,
                    'phoneHome': 1,
                    'regAddresszipCode': 1,
                    'regAddressstreet': 1,
                    'regAddresshouseNumber': 1,
                    'regAddresshouseCorp': 1,
                    'regAddressapartment': 1,
                    'realAddresszipCode': 1,
                    'realAddressstreet': 1,
                    'realAddresshouseNumber': 1,
                    'realAddresshouseCorp': 1,
                    'realAddressapartment': 1,
                    'passportseria': 1,
                    'passportid': 1,
                    'passportdateOfReceving': 1,
                    'passportwhereReseved': 1,
                    'city_id': 1,
                    'isAdmin': 1,
                    'isActive': 1,
                    'emails': 1,
                    'cityName': 1,
                    'creationDate': 1
                },
                'sort': {
                    'cityName': 1,
                    'namelast': 1
                }
            });
        } else {

            return Meteor.users.find({_id: this.userId}, {

                'fields': {
                    'namelast': 1,
                    'namefirst': 1,
                    'namemiddle': 1,
                    'city_id': 1,
                    'cityName': 1,
                    'isActive': 1
                }
            });
        }
    } else {

        this.ready();
        return [];
    }
});
