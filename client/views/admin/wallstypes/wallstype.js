Template.wallstype.helpers({

    'ifChecked': function () {

        if (this.isActive) {

            return 'checked';
        }
    }
});

var eventsMap = EventsMapConstructor('wallstype', [
        {
            'name': 'wallsTypeName',
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
            'fieldName': 'wallsTypeName'
        }
    ],
    false
);

Template.wallstype.events(eventsMap);
