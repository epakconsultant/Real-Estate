Meteor.publish('wallstypes', YaPublisher(Wallstypes, 'wallstypes', ['read']));
Meteor.publish('wallstypesList', YaPublisher(Wallstypes, 'wallstypes', ['list']));
Meteor.publish('wallstypeById', YaPublisher(Wallstypes, 'wallstypes', ['read'], function (context, id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    return {
        _id: id
    };
}));
