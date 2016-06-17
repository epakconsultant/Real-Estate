YaUtilities = {

    'checkUser': function (role) {

        var loggedInUser;


        if (role) {

            if (_.isArray(role)) {

                _.each(role, function (element, index) {

                    role[index] = YaFilter.clean({
                        'source': s(element.toString().toLowerCase()).trim().value(),
                        'type': 'Word'
                    });

                });
            } else {

                role = YaFilter.clean({
                    'source': s(role.toString().toLowerCase()).trim().value(),
                    'type': 'Word'
                });

                role = [role];
            }

        }

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();


        if (role) {

            if (!loggedInUser || !Roles.userIsInRole(loggedInUser, role)) {

                throw new Meteor.Error(403, "Доступ запрещен");
            }
        } else {

            if (!loggedInUser) {

                throw new Meteor.Error(403, "Доступ запрещен");
            }
        }

        return loggedInUser;
    },

    'toPlural': function (name) {

        name = name.toString();

        return name.replace(/y$/ig, 'ie') + 's';
    },

    'toMobile': function (phone) {

        var setCharAt = function (str,index,chr) {

            if(index > str.length-1) {

                return str;
            }

            return str.substr(0,index) + chr + str.substr(index+1);
        }

        phone = phone.toString();

        if (phone.charAt(0) === '8') {

            phone = setCharAt(phone, 0, '7');
        }

        if (phone.charAt(0) === '9') {

            phone = '7' + phone;
        }

        return parseInt(phone, 10);
    },

    'checkMobile': function (phone) {

        phone = phone.toString();

        if (phone.charAt(0) !== '7' || phone.charAt(1) !== '9') {

            return false;
        }

        if (phone.length !== 11) {

            return false;
        }

        return true;
    },

    'parseYouTubeLink': function (youTubeLink) {

        youTubeLink = youTubeLink.toString();

        youTubeLink = youTubeLink.replace(/^(?:https?:\/\/)?(?:www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))/ig, '');

        youTubeLink = YaFilter.clean({
            'source': s(youTubeLink).trim().value(),
            'type': 'WORDNUMS'
        });

        return youTubeLink;
    },

    'createYouTubeLink': function (youTubeId) {

        youTubeId = YaFilter.clean({
            'source': s(youTubeId).trim().value(),
            'type': 'WORDNUMS'
        });

        youTubeId = 'https://youtu.be/' + youTubeId;

        return youTubeId;
    }
};
