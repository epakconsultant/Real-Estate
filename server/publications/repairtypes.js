Meteor.publish('repairtypes', YaPublisher(Repairtypes, 'repairtypes', ['read']));
Meteor.publish('repairtypesList', YaPublisher(Repairtypes, 'repairtypes', ['list']));
Meteor.publish('repairtypeById', YaPublisher(Repairtypes, 'repairtypes', ['read'], function (context, id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    return {
        _id: id
    };
}));
