Template.repairtype.helpers({

    'ifChecked': function () {

        if (this.isActive) {

            return 'checked';
        }
    }
});

var eventsMap = EventsMapConstructor('repairtype', [
        {
            'name': 'repairTypeName',
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
            'fieldName': 'repairTypeName'
        }
    ],
    false
);

Template.repairtype.events(eventsMap);