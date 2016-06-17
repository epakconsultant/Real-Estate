Meteor.publish('estateobjects', YaPublisher(EstateObjects, 'estateobjects', ['read'], function (context, findOptions) {

    var searchObj = {};

    var query = YaFilter.clean({
        'source': s(findOptions.query).trim().value(),
        'type': 'stringUrl'
    }) || '';

    if (query) {

        searchObj.objectName = {$regex: query, $options: "i"}
    }


    var street = YaFilter.clean({
        'source': s(findOptions.street).trim().value(),
        'type': 'stringUrl'
    }) || '';

    if (street) {

        searchObj.street = {$regex: street, $options: "i"}
    }


    var cityblock_ids = findOptions.cityblock_id;

    if (!_.isArray(cityblock_ids)) {

        cityblock_ids = [];
    }

    var new_cityblock_ids = []

    _.each(cityblock_ids, function (element, index, list) {

        var newVal;

        newVal = YaFilter.clean({

            'source': s(element).trim().value(),
            'type': 'alNum'
        }) || '';


        if (newVal) {

            new_cityblock_ids.push(newVal);
        }
    });

    if (new_cityblock_ids.length) {

        searchObj.cityblock_id = {
            $in: new_cityblock_ids
        };
    }


    var category = findOptions.category;

    if (!_.isArray(category)) {

        category = [];
    }

    var new_category = [];

    _.each(category, function (element, index, list) {

        var newVal;

        newVal = YaFilter.clean({
            'source': s(element).trim().value(),
            'type': 'Word'
        }) || '';

        if (!(newVal !== 'newbuild' && newVal !== 'oldbuild')) {

            new_category.push(newVal);
        }
    });

    if (new_category.length) {

        searchObj.category = {
            $in: new_category
        };
    }


    var yearOfEndStart = +YaFilter.clean({
        'source': s(findOptions.yearOfEndStart).trim().value(),
        'type': 'Int'
    }) || 0;

    var yearOfEndEnd = +YaFilter.clean({

        'source': s(findOptions.yearOfEndEnd).trim().value(),
        'type': 'int'
    }) || 0;

    if (yearOfEndStart || yearOfEndEnd) {

        if (yearOfEndStart) {

            if (yearOfEndEnd) {

                searchObj.yearOfEnd = {$gte: yearOfEndStart, $lte: yearOfEndEnd};
            } else {

                searchObj.yearOfEnd = {$gte: yearOfEndStart};
            }
        } else {
            searchObj.yearOfEnd = {$lte: yearOfEndEnd};
        }
    }


    var wallstype_id = findOptions.wallstype_id;

    if (!_.isArray(wallstype_id)) {

        wallstype_id = [];
    }

    var new_wallstype_id = [];

    _.each(wallstype_id, function (element, index, list) {

        var newVal;

        newVal = YaFilter.clean({

            'source': s(element).trim().value(),
            'type': 'alNum'
        }) || '';

        if (newVal) {

            new_wallstype_id.push(newVal);
        }
    });

    if (new_wallstype_id.length) {

        searchObj.wallstype_id = {
            $in: new_wallstype_id
        };
    }


    var estateobjectStatus = findOptions.estateobjectStatus;

    if (!_.isArray(estateobjectStatus)) {

        estateobjectStatus = [];
    }

    var new_estateobjectStatus = [];

    _.each(estateobjectStatus, function (element, index, list) {

        var newVal;

        newVal = YaFilter.clean({
            'source': s(element).trim().value(),
            'type': 'Word'
        }) || '';

        if (newVal && (newVal === 'active' || newVal === 'archive')) {

                new_estateobjectStatus.push(newVal);
        }
    });

    if (new_estateobjectStatus.length) {

        searchObj.estateobjectStatus = {
            $in: new_estateobjectStatus
        };
    }

    return searchObj;
}, function (context, findOptions) {

    var limit = parseInt(findOptions.limit) || 5;

    return limit;
}));

Meteor.publish('estateobjectById', YaPublisher(EstateObjects, 'estateobjects', ['read'], function (context, id) {

    id = YaFilter.clean({
        source: s(id).trim().value(),
        type: 'AlNum'
    });

    if (context.userId) {

        var userId = YaFilter.clean({
            source: s(context.userId).trim().value(),
            type: 'AlNum'
        });

        loggedInUser = Meteor.users.findOne(userId);

        var city_id = loggedInUser.city_id;
    } else {

        var city_id = Cities.findOne({'cityName': 'Иваново'})._id;
    }

    return {
        _id: id,
        city_id: city_id
    };
}));

Meteor.publish('estateobjectsList', function (findOptions) {

    var loggedInUser,
        limit,
        estateobjectsStatus,
        searchObj,
        query,
        minPrice,
        maxPrice,
        cityblock_id,
        typeofestate_id;

    if (this.userId) {

        loggedInUser = Meteor.users.findOne(this.userId);

        if (Roles.userIsInRole(loggedInUser, ['admin','manager'])) {

            limit = parseInt(findOptions.limit) || 5;


            estateobjectsStatus = findOptions.estateobjectStatus;

            if (estateobjectsStatus !== 'active' && estateobjectsStatus !== 'adv' && estateobjectsStatus !== 'archive' && estateobjectsStatus !== 'call') {

                estateobjectsStatus = 'active';
            }


            searchObj = {
                'estateobjectStatus': estateobjectsStatus,
                'city_id': loggedInUser.city_id
            };


            query = YaFilter.clean({
                'source': s(findOptions.query).trim().value(),
                'type': 'stringUrl'
            }) || '';

            if (query) {

                searchObj.street = {$regex: query, $options: "i"}
            }


            minPrice = YaFilter.clean({

                'source': s(findOptions.minPrice).trim().value(),
                'type': 'int'
            }) || '';

            minPrice = minPrice || 0;

            maxPrice = YaFilter.clean({

                'source': s(findOptions.maxPrice).trim().value(),
                'type': 'int'
            }) || '';

            maxPrice = maxPrice || 0;

            if (minPrice || maxPrice) {

                if (minPrice) {

                    if (maxPrice) {

                        searchObj.price = {$gte: minPrice, $lte: maxPrice};
                    } else {

                        searchObj.price = {$gte: minPrice};
                    }
                } else {
                    searchObj.price = {$lte: maxPrice};
                }
            }

            var cityblock_ids = findOptions.cityblock_id;

            if (!_.isArray(cityblock_ids)) {

                cityblock_ids = [];
            }


             _.each(cityblock_ids, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({

                    'source': s(element).trim().value(),
                    'type': 'alNum'
                }) || '';

                cityblock_ids[index] = newVal;
            });


            if (cityblock_ids.length) {

                searchObj.cityblock_id = {
                    $in: cityblock_ids
                };
            }


            var typeofestate_ids = findOptions.typeofestate_id;

            if (!_.isArray(typeofestate_ids)) {

                typeofestate_ids = [];
            }


             _.each(typeofestate_ids, function (element, index, list) {

                var newVal;

                newVal = YaFilter.clean({

                    'source': s(element).trim().value(),
                    'type': 'alNum'
                }) || '';

                typeofestate_ids[index] = newVal;
            });

            if (typeofestate_ids.length) {

                searchObj.typeofestate_id = {
                    $in: typeofestate_ids
                };
            }

            return EstateObjects.find(searchObj, {
                'sort': {
                    'modifyDate': 1,
                    'creationDate': -1
                },
                'limit': limit
            });
        } else {

            this.ready();
            return [];
        }
    } else {

        this.ready();
        return [];
    }
});
