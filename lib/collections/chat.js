Chat = new Mongo.Collection('chat');

Meteor.methods({

    'insertMessage': function (attributes) {

        var loggedInUser,
            entity,
            entityId;

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'chat', 'create');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }

        entity = {
            'message':  YaFilter.clean({
                'source': s(attributes.message).trim().value(),
                'type': 'String'
            }),

            'reciver': YaFilter.clean({
                'source': s(attributes.reciver).trim().value(),
                'type': 'AlNum'
            }),

            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'creationDate': new Date()
        };

        if (!entity.reciver) {

            entity.reciver = 'all';
        } else {

            var reciverUser = Meteor.users.findOne({
                '_id': entity.reciver,
                'isActive': true
            });

            if (!reciverUser) {

                return {
                    'status': 'error',
                    'message': 'Вы не можете отправить сообщение указанному пользователю'
                }
            }
        }

        entity.message = Autolinker.link(entity.message);

        check(entity, {

            'message': String,

            'reciver': String,

            'userId': String,

            'author': String,

            'creationDate': Date
        });

        entityId = Chat.insert(entity);

        return {
            'status': 'note',
            'message': 'Сообщение отправлено',
            '_id': entityId
        };
    }
});
