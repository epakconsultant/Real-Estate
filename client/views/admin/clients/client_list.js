Template.clientsList.helpers({
    'ifActive': function () {

        if (this.clientsStatus === 'active') {

            return 'selected';
        }
    },

    'ifNew': function () {

        if (this.clientsStatus === 'new') {

            return 'selected';
        }
    },

    'ifAdv': function () {

        if (this.clientsStatus === 'adv') {
            
            return 'selected';
        }
    },

    'ifArchive': function () {

        if (this.clientsStatus === 'archive') {
            
            return 'selected';
        }
    }
});

Template.clientsList.events({

    'change #by-status': function (e) {

        var entityId;

        e.preventDefault();

        entityId = $.trim(YaRequest.getAlnum('by-status', '', 'INPUT'));

        if (entityId === 'adv') {

            Router.go('clientsadv');
        } else if (entityId === 'archive') {

            Router.go('clientsarchive');
        } else if (entityId === 'active') {

            Router.go('clients');
        } else if (entityId === 'new') {

            Router.go('clientsreg');
        }
    },

    'click .archiveBtn': function (e) {

        var id;

        e.preventDefault();

        id = $(e.target).data('id');

        id = YaFilter.clean({
            'source': s(id).trim().value(),
            'type': 'AlNum'
        });
        
        Meteor.call('clientArchive', id, function (error) {

            if (error) {

                // display the error to the user
                alert(error.reason);
            } else {

                alert('Клиент архивирован');
                
            }
        });
    }
});

