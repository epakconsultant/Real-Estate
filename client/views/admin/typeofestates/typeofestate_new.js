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
    true
);

Template.typeofestateNew.events(eventsMap);