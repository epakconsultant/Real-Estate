Meteor.methods({

	'getCoords': function (findOptions) {

        var loggedInUser = Meteor.user();

        if (loggedInUser) {

            var city_id = loggedInUser.city_id;
        } else {

            var city = Cities.findOne({'cityName': 'Иваново'});

            var city_id = city._id;
        }

        
        estateobjectsStatus = 'active';
        

        searchObj = {
            'estateobjectStatus': 'active', 
            'city_id': city_id
        };


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


        var fields = {
            'price': 1,
            'street': 1,
            'houseNumber': 1,
            'coords': 1,
            'cityblock_id': 1,
            'typeofestate_id': 1,
            'repairtype_id': 1,
            'uploadedImages': 1,
            'modifyDate': 1,
            'creationDate': 1,
            'estateobjectStatus': 1
        }


        return EstateObjects.find(searchObj, {
        
            'fields': fields,
            
            'sort': {
                'creationDate': -1,
                'modifyDate': -1,
            }
        }).fetch();
    }
});