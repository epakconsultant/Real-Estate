Template.typeofestate.helpers({

    'ifChecked': function () {

        if (this.isActive) {

            return 'checked';
        }
    }
});

var eventsMap = EventsMapConstructor('typeofestate', [
        {
            'name': 'typeOfEstateName',
            'type': 'string',
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
            'fieldName': 'typeOfEstateName'
        }
    ],
    false
);

Template.typeofestate.events(eventsMap);