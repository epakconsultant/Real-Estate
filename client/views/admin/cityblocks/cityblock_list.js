Template.cityBlocksList.helpers({
    'cities': function () {

        var cities,
            that;

        that = this;

        cities = Cities.find().fetch();
        
        _.each(cities, function (value) {

            if (value._id === that._id) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return cities;
    }
});

Template.cityBlocksList.events({

    'change #by-city-id': function (e) {

    	var entityId

        e.preventDefault();

        entityId = $.trim(YaRequest.getAlnum('by-city-id', '', 'INPUT'));

        if (entityId) {

            Router.go('cityblocksByCity', {_id: entityId});
        } else {
        	
            Router.go('cityblocks');
        }
    }
});