Meteor.methods({

	'checkPhone': function (phone) {

        var loggedInUser,
            obj,
            blacklist,
            client;


        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);
        
        
        phone = YaFilter.clean({
            'source': s(phone).trim().value(),
            'type': 'Number'
        });


        // Clean _id
        check(phone, Number);

        blacklist = BlackList.findOne({'phone': phone});
        
        obj = EstateObjects.findOne({'phone': phone});

        client = Clients.findOne({'phone': phone});

        if (blacklist) {

            return {
                'type': 'blacklist',
                'obj': blacklist
            };
        } else if (client) {

        	return {
                'type': 'client',
                'obj': client
            };
        } else if (obj) {

            return {
                'type': 'object',
                'obj': obj
            };
        }

        return null;
    }
});