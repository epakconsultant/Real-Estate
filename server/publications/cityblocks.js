Meteor.publish('cityblocks', YaPublisher(CityBlocks, 'cityblocks', ['read']));

Meteor.publish('cityblockById', YaPublisher(CityBlocks, 'cityblocks', ['read'], function (context, id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    return {
        _id: id
    };
}));

Meteor.publish('cityblockByCity', YaPublisher(CityBlocks, 'cityblocks', ['read'], function (context, id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    return {
        city_id: id
    };
}));

Meteor.publish('cityblocksByUser', YaPublisher(CityBlocks, 'cityblocks', ['list'], function (context, id) {

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
        city_id: city_id
    };
}));
