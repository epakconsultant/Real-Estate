Meteor.publish('generalChat', YaPublisher(Chat, 'chat', ['read'], function () {

    return {
        'reciver': 'all'
    };
}))
