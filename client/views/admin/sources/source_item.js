Template.source.helpers({

    'ifChecked': function () {

        if (this.isActive) {

            return 'checked';
        }
    }
});

var eventsMap = EventsMapConstructor('source', [
        {
            'name': 'sourceName',
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
            'fieldName': 'sourceName'
        }
    ],
    false
);

Template.source.events(eventsMap);