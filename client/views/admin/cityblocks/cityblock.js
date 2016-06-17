Template.cityblock.helpers({

    'ifChecked': function () {

        if (this.isActive) {

            return 'checked';
        }
    },

    'cities': function () {

        var cities,
            that;

        that = this;

        cities = Cities.find().fetch();

        _.each(cities, function (value) {

            if (value._id === that.city_id) {

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


var eventsMap = EventsMapConstructor('cityblock', [
        {
            'name': 'cityBlockName',
            'type': 'string',
            'defaultVal': '',
            'inputType': 'input'
        },
        {
            'name': 'cityBlockRoads',
            'type': 'string',
            'defaultVal': '',
            'inputType': 'input'
        },
        {
            'name': 'cityBlockNumber',
            'type': 'int',
            'defaultVal': '',
            'inputType': 'input'
        },
        {
            'name': 'city_id',
            'type': 'alnum',
            'defaultVal': '',
            'inputType': 'input'
        },
        {
            'name': 'isActive',
            'type': 'bool',
            'defaultVal': false,
            'inputType': 'select'
        }
    ],
    [
        {
            'fieldName': 'cityBlockName'
        },
        {
            'fieldName': 'cityBlockRoads'
        },
        {
            'fieldName': 'cityBlockNumber'
        },
        {
            'fieldName': 'city_id'
        }
    ],
    false
);

Template.cityblock.events(eventsMap);
