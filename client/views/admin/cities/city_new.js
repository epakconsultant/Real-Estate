var eventsMap = EventsMapConstructor('city', [
        {
            'name': 'cityName',
            'type': 'string',
            'defaultVal': '',
            'inputType': 'input'
        },
        {
            'name': 'phone',
            'type': 'number',
            'defaultVal': '',
            'inputType': 'input'
        },
        {
            'name': 'coordX',
            'type': 'float',
            'defaultVal': '',
            'inputType': 'input'
        },
        {
            'name': 'coordY',
            'type': 'float',
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
            'fieldName': 'cityName'
        },
        {
            'fieldName': 'coordX'
        },
        {
            'fieldName': 'coordY'
        },
        {
            'fieldName': 'phone',
            'intVal': true
        }
    ],
    true
);

Template.cityNew.events(eventsMap);