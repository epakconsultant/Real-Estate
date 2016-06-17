var eventsMap = EventsMapConstructor('resource', [
        {
            'name': 'resourceName',
            'type': 'string',
            'defaultVal': '',
            'inputType': 'input'
        }
    ],
    [
        {
            'fieldName': 'resourceName'
        }
    ],
    true
);

Template.resourceNew.events(eventsMap);
