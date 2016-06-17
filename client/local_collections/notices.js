Notices = new Meteor.Collection(null);

clearNotice = function (id) {

    id = YaFilter.clean({
        'source': s(id).trim().value(),
        'type': 'AlNum'
    });

	Notices.remove({'_id': id});
};

showNotice = function (type, message) {

	var id = Notices.insert({
		type: type,
		message: message,
		seen: false
	});

    Meteor.setTimeout(function () {

        clearNotice(id);
    }, 3000);
};
