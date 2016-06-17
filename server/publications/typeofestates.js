Meteor.publish('typeofestates', YaPublisher(Typeofestates, 'typeofestates', ['read']));
Meteor.publish('typeofestatesList', YaPublisher(Typeofestates, 'typeofestates', ['list']));
Meteor.publish('typeofestateById', YaPublisher(Typeofestates, 'typeofestates', ['read'], function (context, id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    return {
        _id: id
    };
}));
