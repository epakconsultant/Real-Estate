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
    true
);

Template.wallstypeNew.events(eventsMap);
