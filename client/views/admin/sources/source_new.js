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
    true
);

Template.sourceNew.events(eventsMap);