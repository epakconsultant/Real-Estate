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
    true
);

Template.repairtypeNew.events(eventsMap);