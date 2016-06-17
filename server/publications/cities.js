Meteor.publish('cities', YaPublisher(Cities, 'cities', ['read']));
Meteor.publish('cityById', YaPublisher(Cities, 'cities', ['read'], function (context, id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    return {
        _id: id
    };
}));
Meteor.publish('citiesByUser', YaPublisher(Cities, 'cities', ['list'], function (context) {

    if (context.userId) {

        var userId = YaFilter.clean({
            source: s(context.userId).trim().value(),
            type: 'AlNum'
        });

        loggedInUser = Meteor.users.findOne(userId);

        var city_id = loggedInUser.city_id;
    } else {

        var city_id = Cities.findOne({'cityName': 'Иваново'})._id;
    }

    return {
        _id: city_id
    };
}));
