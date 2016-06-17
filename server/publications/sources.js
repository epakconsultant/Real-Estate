Meteor.publish('sources', YaPublisher(Sources, 'sources', ['read']));
Meteor.publish('sourcesList', YaPublisher(Sources, 'sources', ['list']));
Meteor.publish('sourceById', YaPublisher(Sources, 'sources', ['read'], function (context, id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    return {
        _id: id
    };
}));
