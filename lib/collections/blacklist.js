var alreadyInBlackList;

BlackList = new Mongo.Collection('blacklist');

alreadyInBlackList = function (phone) {

    return BlackList.findOne({'phone': phone});
};

Meteor.methods({

    'addToBlackList': function (phone) {

        var loggedInUser,
            clients_ids,
            objects_ids;


        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);


        phone = YaFilter.clean({
            'source': s(phone).trim().value(),
            'type': 'Number'
        });

        if (phone) {

            if (alreadyInBlackList(phone)) {

                return {
                	'status': 'error',
                	'message': 'Телефон уже в черном списке.'
                }
            }


            // Save number in the black list.
            BlackList.insert({
                'phone': phone,
                'userId': loggedInUser._id,
                'author': loggedInUser.fullname,
                'creationDate': new Date()
            });
         

            if (Meteor.isServer) {

                EventDispatcher.emit('onBlackListAdd', {
                    data: {
                        'phone': phone,
                        'userId': loggedInUser._id
                    }
                });
            }

            
            return {
            	'status': 'note',
            	'message': 'Телефон добавлен в черный список.'
            };
        } else {

            return {
            	'status': 'error',
            	'message': 'Телефон указан неверно.'
            }
        }
    },

    'searchPhone': function (phone) {

        var loggedInUser,
            statusesHash,
            inBlackList,
            inClients,
            inObjects,
            haveErrors = false,
            errors = [];


        loggedInUser = YaUtilities.checkUser(['admin', 'manager']);


        statusesHash = {
            'activeclient': 'Актуальный клиент',
            'newclient': 'Новый клиент',
            'advclient': 'Рекламный клиент',
            'archiveclient': 'Архивный клиент',
            'activeobject': 'Актуальный объект',
            'advobject': 'Коммерческий объект',
            'archiveobject': 'Архивный объект',
            'callobject': 'Объект для прозвона',
            'blacklist': 'В черном списке',
            'normalPhone': 'Нет в базе',
            'errornote': 'Некорректный номер'
        };


        phone = YaFilter.clean({
            'source': s(phone).trim().value(),
            'type': 'Number'
        });

        if (!phone) {

            haveErrors = true;
        }


        phone = phone.toString();


        var setCharAt = function (str,index,chr) {

            if(index > str.length-1) {

                return str;
            }

            return str.substr(0,index) + chr + str.substr(index+1);
        };


        if (phone.length >= 12) {

            haveErrors = true;
        }


        if (phone.length == 11) {

            if (phone.charAt(0) == '8') {

                phone = setCharAt(phone, 0, '7');
            }

            if (phone.charAt(0) != '7') {

                haveErrors = true;
            }

            if (phone.charAt(1) != '9' && phone.charAt(1) != '4') {

                haveErrors = true;
            }
        }


        inBlackList = BlackList.find({
            $where: '/.*' + phone + '.*/.test(this.phone)'
        }).fetch();

        inClients = Clients.find({
            $where: '/.*' + phone + '.*/.test(this.phone)'
        }).fetch();

        inObjects = EstateObjects.find({
            $where: '/.*' + phone + '.*/.test(this.phone)'
        }).fetch();


        var resultArr = [];

        if (inBlackList.length) {

            _.each(inBlackList, function (element, index) {

                var markedPhone = '';

                var innerPhone = element.phone.toString();

                var startPos = innerPhone.indexOf(phone);
                var finishPos = startPos + phone.length;

                markedPhone = innerPhone.substring(0, startPos) + '<span class="marked-digits">' + innerPhone.substring(startPos, finishPos) + '</span>' + innerPhone.substring(finishPos);
                
                resultArr.push({
                    'status': 'note',
                    'phone': markedPhone,
                    'message': statusesHash['blacklist'],
                    'url': false
                });
            });
        }

        if (inClients) {

            _.each(inClients, function (element, index) {

                var markedPhone = '';

                var innerPhone = element.phone.toString();
                
                var startPos = innerPhone.indexOf(phone);
                var finishPos = startPos + phone.length;

                markedPhone = innerPhone.substring(0, startPos) + '<span class="marked-digits">' + innerPhone.substring(startPos, finishPos) + '</span>' + innerPhone.substring(finishPos);
                
                resultArr.push({
                    'status': 'note',
                    'phone': markedPhone,
                    'message': statusesHash[element.clientStatus + 'client'],
                    'url': '/client/' + element._id
                });
            });
        }

        if (inObjects) {

            _.each(inObjects, function (element, index) {

                var markedPhone = '';

                var innerPhone = element.phone.toString();
                
                var startPos = innerPhone.indexOf(phone);
                var finishPos = startPos + phone.length;

                markedPhone = innerPhone.substring(0, startPos) + '<span class="marked-digits">' + innerPhone.substring(startPos, finishPos) + '</span>' + innerPhone.substring(finishPos);
                
                resultArr.push({
                    'status': 'note',
                    'phone': markedPhone,
                    'message': statusesHash[element.estateobjectStatus + 'object'],
                    'url': '/estateobject/' + element._id
                });
            });
        }

        if (haveErrors) {

            return {
                'status': 'error',
                'message': statusesHash['errornote']
            }
        } else if (resultArr.length) {

            return {

                'status': 'note',
                'searchResults': resultArr
            }
        } else {

            return {
                'status': 'note',
                'searchResults': [
                    {   
                        'status': 'note',
                        'phone': false,
                        'message': statusesHash['normalPhone'],
                        'url': false
                    }
                ]
            }
        }
    },

    'removeFromBlackList': function (phone) {

        var loggedInUser;


        loggedInUser = YaUtilities.checkUser('admin');


        phone = YaFilter.clean({
            'source': s(phone).trim().value(),
            'type': 'Number'
        });


        BlackList.remove({
            'phone': phone
        }, function (err, docs) {

            if (err) {

                // display the error to the user
                throw new Meteor.Error('Error', err.reason);
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onBlackListRemove', {
                    data: {
                        'phone': phone,
                        'userId': loggedInUser._id
                    }
                });
            }
        });

        return {
        	'status': 'note',
        	'message': 'Телефон удален из черного списка.'
        };
    }
});