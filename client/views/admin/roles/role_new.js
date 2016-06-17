var eventsMap = EventsMapConstructor('role', [
        {
            'name': 'roleName',
            'type': 'string',
            'defaultVal': '',
            'inputType': 'input'
        }
    ],
    [
        {
            'fieldName': 'roleName'
        }
    ],
    true
);

Template.roleNew.events(eventsMap);
