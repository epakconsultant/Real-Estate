EstateObjects = new Mongo.Collection('estateobjects');

Meteor.methods({

    'estateobjectInsert': function (attributes) {

        var loggedInUser,
            city_id,
            city,
            cityName,
            entity,
            dateOfOpening,
            entityId,
            haveErrors = false,
            errors = [];

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'estateobjects', 'create');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }

        city_id = YaFilter.clean({
            'source': s(loggedInUser.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({_id: city_id});

        if (!city) {

           // No such city
            return {
                'status': 'error',
                'result': 'Города с id ' + city_id + ' не существует.'
            }
        }

        cityName = city.cityName;


        entity = {

            'objectName': YaFilter.clean({
                'source': s(attributes.objectName).trim().value(),
                'type': 'String'
            }), // required

            'cityblock_id': YaFilter.clean({
                'source': s(attributes.cityblock_id).trim().value(),
                'type': 'AlNum'
            }), // required

            'street': YaFilter.clean({
                'source': s(attributes.street).trim().value(),
                'type': 'String'
            }), // required

            'houseNumber': YaFilter.clean({
                'source': s(attributes.houseNumber).trim().value(),
                'type': 'String'
            }),

            'corpNumber': YaFilter.clean({
                'source': s(attributes.corpNumber).trim().value(),
                'type': 'String'
            }),

            'strNumber': YaFilter.clean({
                'source': s(attributes.strNumber).trim().value(),
                'type': 'String'
            }),

            'isMapCorrect': YaFilter.clean({
                'source': s(attributes.isMapCorrect).trim().value(),
                'type': 'Boolean'
            }),

            'category': YaFilter.clean({
                'source': s(attributes.category).trim().value(),
                'type': 'Word'
            }), // required - newbuild || oldbuild

            'yearOfEnd': YaFilter.clean({
                'source': s(attributes.yearOfEnd).trim().value(),
                'type': 'Int'
            }), // required - 1960 : current + 4

            'quartalOfEnd':YaFilter.clean({
                'source': s(attributes.quartalOfEnd).trim().value(),
                'type': 'Int'
            }), // required, if new build, else 0 - 0,1,2,3,4

            'wallstype_id': YaFilter.clean({
                'source': s(attributes.wallstype_id).trim().value(),
                'type': 'Alnum'
            }), // required

            'floority': YaFilter.clean({
                'source': s(attributes.floority).trim().value(),
                'type': 'Int'
            }), // required

            'isCar': YaFilter.clean({
                'source': s(attributes.isCar).trim().value(),
                'type': 'Boolean'
            }),

            'isCommerce': YaFilter.clean({
                'source': s(attributes.isCommerce).trim().value(),
                'type': 'Boolean'
            }),

            'thumbVideo': YaFilter.clean({
                'source': s(attributes.thumbVideo).trim().value(),
                'type': 'Wordnums'
            }),

            'fullVideo': YaFilter.clean({
                'source': s(attributes.fullVideo).trim().value(),
                'type': 'Wordnums'
            }),

            'shops': YaFilter.clean({
                'source': s(attributes.shops).trim().value(),
                'type': 'String'
            }),

            'tradeCenters': YaFilter.clean({
                'source': s(attributes.tradeCenters).trim().value(),
                'type': 'String'
            }),

            'kindergardens': YaFilter.clean({
                'source': s(attributes.kindergardens).trim().value(),
                'type': 'String'
            }),

            'schools': YaFilter.clean({
                'source': s(attributes.schools).trim().value(),
                'type': 'String'
            }),

            'medicCenters': YaFilter.clean({
                'source': s(attributes.medicCenters).trim().value(),
                'type': 'String'
            }),

            'joyCenters': YaFilter.clean({
                'source': s(attributes.joyCenters).trim().value(),
                'type': 'String'
            }),

            'transport': YaFilter.clean({
                'source': s(attributes.transport).trim().value(),
                'type': 'String'
            }),

            'desc': YaFilter.clean({
                'source': s(attributes.desc).trim().value(),
                'type': 'Html'
            }),

            'estateobjectStatus': 'active',

            'city_id': city_id,

            'cityName': cityName,

            'userId': loggedInUser._id,

            'author': loggedInUser.fullname,

            'modifyDate': new Date(),

        	'creationDate': new Date()
        };

        if (!entity.objectName) {

            errors.push('objectName');
            haveErrors = true;
        }

        if (!entity.cityblock_id) {

            errors.push('cityblock_id');
            haveErrors = true;
        }

        if (!entity.street) {

            errors.push('street');
            haveErrors = true;
        }

        if (!entity.category || !(entity.category === 'newbuild' || entity.category === 'oldbuild')) {

            errors.push('category');
            haveErrors = true;
        }

        var currentDate = new Date();

        var currentYear = currentDate.getYear() + 1900 + 4;

        var yearRange = _.range(currentYear, 1960, -1);

        if (!entity.yearOfEnd || (_.indexOf(yearRange, entity.yearOfEnd) === -1)) {

            errors.push('yearOfEnd');
            haveErrors = true;
        }

        if (entity.category === 'newbuild' && (!entity.quartalOfEnd || _.indexOf([1, 2, 3, 4], entity.quartalOfEnd) === -1)) {

            errors.push('quartalOfEnd');
            haveErrors = true;
        } else if (entity.category === 'oldbuild') {

            entity.quartalOfEnd = 0;
        }

        if (!entity.wallstype_id) {

            errors.push('wallstype_id');
            haveErrors = true;
        }

        if (haveErrors) {

            return {

                'status': 'error',
                'result': errors
            }
        }


        check(entity, {

            'objectName': String,

            'cityblock_id': String,

            'street': String,

            'houseNumber': String,

            'corpNumber': String,

            'strNumber': String,

            'isMapCorrect': Boolean,

            'category': String,

            'yearOfEnd': Number, // required - 1960 : current + 4

            'quartalOfEnd':Number, // required, if new build, else 0 - 0,1,2,3,4

            'wallstype_id': String,

            'floority': Number, // required

            'isCar': Boolean,

            'isCommerce': Boolean,

            'thumbVideo': String,

            'fullVideo': String,

            'shops': String,

            'tradeCenters': String,

            'kindergardens': String,

            'schools': String,

            'medicCenters': String,

            'joyCenters': String,

            'transport': String,

            'desc': String,

            'estateobjectStatus': String,

            'city_id': String,

            'cityName': String,

            'userId': String,

            'author': String,

            'modifyDate': Date,

            'creationDate': Date
        });


        var uploadedImages = attributes.uploadedImages;

        if (!_.isArray(uploadedImages)) {

            uploadedImages = [];
        }


        _.each(uploadedImages, function (element, index) {

            var name = YaFilter.clean({
                'source': s(element.name).trim().value(),
                'type': 'Img'
            });

            var subDirectory = YaFilter.clean({
                'source': s(element.subDirectory).trim().value(),
                'type': 'Cmd'
            });

            uploadedImages[index] = {
                'subDirectory': subDirectory,
                'name': name
            };
        });

        entity.uploadedImages = uploadedImages;


        var planningsImages = attributes.planningsImages;

        if (!_.isArray(planningsImages)) {

            planningsImages = [];
        }


        _.each(planningsImages, function (element, index) {

            var name = YaFilter.clean({
                'source': s(element.name).trim().value(),
                'type': 'Img'
            });

            var subDirectory = YaFilter.clean({
                'source': s(element.subDirectory).trim().value(),
                'type': 'Cmd'
            });

            planningsImages[index] = {
                'subDirectory': subDirectory,
                'name': name
            };
        });

        entity.planningsImages = planningsImages;


        var coords = attributes.coords;

        if (!_.isArray(coords)) {

            coords = [];
        }

        _.each(coords, function (element, index) {

            coords[index] = YaFilter.clean({
                'source': s(element).trim().value(),
                'type': 'Float'
            });
        });

        entity.coords = coords;

        var allowedFields = Acl.allowedFields(loggedInUser._id, 'estateobjects', 'create');

        if (allowedFields && _.isArray(allowedFields)) {

            allowedFields = _.union(allowedFields, ['userId', 'author', 'creationDate', 'estateobjectStatus', 'modifyDate', 'city_id', 'cityName']);

            var newEntity = {};

            _.each(allowedFields, function (allowedField) {

                if (_.has(entity, allowedField)) {

                    newEntity[allowedField] = entity[allowedField];
                }
            });

            entity = newEntity;
        }

        // Update record
        entityId = EstateObjects.insert(entity);


        entity = _.extend(entity, {
            '_id': entityId
        });

        if (Meteor.isServer) {
            EventDispatcher.emit('onObjectSave', {
                data: {
                    'isNew': true,
                    'entity': entity
                }
            });
        }


        return {
            'status': 'note',
        	'_id': entityId
        };
    },

    'estateobjectUpdate': function (_id, attributes) {

        var loggedInUser,
            city_id,
            city,
            cityName,
            entity,
            dateOfOpening,
            entityId,
            haveErrors = false,
            errors = [];

        check(Meteor.userId(), String);

        loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'estateobjects', 'edit');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }

        city_id = YaFilter.clean({
            'source': s(loggedInUser.city_id).trim().value(),
            'type': 'AlNum'
        });

        city = Cities.findOne({_id: city_id});

        if (!city) {

           // No such city
            return {
                'status': 'error',
                'result': 'Города с id ' + city_id + ' не существует.'
            }
        }

        cityName = city.cityName;


        entity = {

            'objectName': YaFilter.clean({
                'source': s(attributes.objectName).trim().value(),
                'type': 'String'
            }), // required

            'cityblock_id': YaFilter.clean({
                'source': s(attributes.cityblock_id).trim().value(),
                'type': 'AlNum'
            }), // required

            'street': YaFilter.clean({
                'source': s(attributes.street).trim().value(),
                'type': 'String'
            }), // required

            'houseNumber': YaFilter.clean({
                'source': s(attributes.houseNumber).trim().value(),
                'type': 'String'
            }),

            'corpNumber': YaFilter.clean({
                'source': s(attributes.corpNumber).trim().value(),
                'type': 'String'
            }),

            'strNumber': YaFilter.clean({
                'source': s(attributes.strNumber).trim().value(),
                'type': 'String'
            }),

            'isMapCorrect': YaFilter.clean({
                'source': s(attributes.isMapCorrect).trim().value(),
                'type': 'Boolean'
            }),

            'category': YaFilter.clean({
                'source': s(attributes.category).trim().value(),
                'type': 'Word'
            }), // required - newbuild || oldbuild

            'yearOfEnd': YaFilter.clean({
                'source': s(attributes.yearOfEnd).trim().value(),
                'type': 'Int'
            }), // required - 1960 : current + 4

            'quartalOfEnd':YaFilter.clean({
                'source': s(attributes.quartalOfEnd).trim().value(),
                'type': 'Int'
            }), // required, if new build, else 0 - 0,1,2,3,4

            'wallstype_id': YaFilter.clean({
                'source': s(attributes.wallstype_id).trim().value(),
                'type': 'Alnum'
            }), // required

            'floority': YaFilter.clean({
                'source': s(attributes.floority).trim().value(),
                'type': 'Int'
            }), // required

            'isCar': YaFilter.clean({
                'source': s(attributes.isCar).trim().value(),
                'type': 'Boolean'
            }),

            'isCommerce': YaFilter.clean({
                'source': s(attributes.isCommerce).trim().value(),
                'type': 'Boolean'
            }),

            'thumbVideo': YaFilter.clean({
                'source': s(attributes.thumbVideo).trim().value(),
                'type': 'Wordnums'
            }),

            'fullVideo': YaFilter.clean({
                'source': s(attributes.fullVideo).trim().value(),
                'type': 'Wordnums'
            }),

            'shops': YaFilter.clean({
                'source': s(attributes.shops).trim().value(),
                'type': 'String'
            }),

            'tradeCenters': YaFilter.clean({
                'source': s(attributes.tradeCenters).trim().value(),
                'type': 'String'
            }),

            'kindergardens': YaFilter.clean({
                'source': s(attributes.kindergardens).trim().value(),
                'type': 'String'
            }),

            'schools': YaFilter.clean({
                'source': s(attributes.schools).trim().value(),
                'type': 'String'
            }),

            'medicCenters': YaFilter.clean({
                'source': s(attributes.medicCenters).trim().value(),
                'type': 'String'
            }),

            'joyCenters': YaFilter.clean({
                'source': s(attributes.joyCenters).trim().value(),
                'type': 'String'
            }),

            'transport': YaFilter.clean({
                'source': s(attributes.transport).trim().value(),
                'type': 'String'
            }),

            'desc': YaFilter.clean({
                'source': s(attributes.desc).trim().value(),
                'type': 'Html'
            }),

            'city_id': city_id,

            'cityName': cityName,

            'modifyDate': new Date()
        };

        if (!entity.objectName) {

            errors.push('objectName');
            haveErrors = true;
        }

        if (!entity.cityblock_id) {

            errors.push('cityblock_id');
            haveErrors = true;
        }

        if (!entity.street) {

            errors.push('street');
            haveErrors = true;
        }

        if (!entity.category || !(entity.category === 'newbuild' || entity.category === 'oldbuild')) {

            errors.push('category');
            haveErrors = true;
        }

        var currentDate = new Date();

        var currentYear = currentDate.getYear() + 1900 + 4;

        var yearRange = _.range(currentYear, 1960, -1);

        if (!entity.yearOfEnd || (_.indexOf(yearRange, entity.yearOfEnd) === -1)) {

            errors.push('yearOfEnd');
            haveErrors = true;
        }

        if (entity.category === 'newbuild' && (!entity.quartalOfEnd || _.indexOf([1, 2, 3, 4], entity.quartalOfEnd) === -1)) {

            errors.push('quartalOfEnd');
            haveErrors = true;
        } else if (entity.category === 'oldbuild') {

            entity.quartalOfEnd = 0;
        }

        if (!entity.wallstype_id) {

            errors.push('wallstype_id');
            haveErrors = true;
        }

        if (haveErrors) {

            return {

                'status': 'error',
                'result': errors
            }
        }


        check(entity, {

            'objectName': String,

            'cityblock_id': String,

            'street': String,

            'houseNumber': String,

            'corpNumber': String,

            'strNumber': String,

            'isMapCorrect': Boolean,

            'category': String,

            'yearOfEnd': Number, // required - 1960 : current + 4

            'quartalOfEnd':Number, // required, if new build, else 0 - 0,1,2,3,4

            'wallstype_id': String,

            'floority': Number, // required

            'isCar': Boolean,

            'isCommerce': Boolean,

            'thumbVideo': String,

            'fullVideo': String,

            'shops': String,

            'tradeCenters': String,

            'kindergardens': String,

            'schools': String,

            'medicCenters': String,

            'joyCenters': String,

            'transport': String,

            'desc': String,

            'city_id': String,

            'cityName': String,

            'modifyDate': Date
        });


        var uploadedImages = attributes.uploadedImages;

        if (!_.isArray(uploadedImages)) {

            uploadedImages = [];
        }


        _.each(uploadedImages, function (element, index) {

            var name = YaFilter.clean({
                'source': s(element.name).trim().value(),
                'type': 'Img'
            });

            var subDirectory = YaFilter.clean({
                'source': s(element.subDirectory).trim().value(),
                'type': 'Cmd'
            });

            uploadedImages[index] = {
                'subDirectory': subDirectory,
                'name': name
            };
        });

        entity.uploadedImages = uploadedImages;


        var planningsImages = attributes.planningsImages;

        if (!_.isArray(planningsImages)) {

            planningsImages = [];
        }


        _.each(planningsImages, function (element, index) {

            var name = YaFilter.clean({
                'source': s(element.name).trim().value(),
                'type': 'Img'
            });

            var subDirectory = YaFilter.clean({
                'source': s(element.subDirectory).trim().value(),
                'type': 'Cmd'
            });

            planningsImages[index] = {
                'subDirectory': subDirectory,
                'name': name
            };
        });

        entity.planningsImages = planningsImages;


        var coords = attributes.coords;

        if (!_.isArray(coords)) {

            coords = [];
        }

        _.each(coords, function (element, index) {

            coords[index] = YaFilter.clean({
                'source': s(element).trim().value(),
                'type': 'Float'
            });
        });

        entity.coords = coords;

        var allowedFields = Acl.allowedFields(loggedInUser._id, 'estateobjects', 'edit');

        if (allowedFields && _.isArray(allowedFields)) {

            allowedFields = _.union(allowedFields, ['modifyDate', 'city_id', 'cityName']);

            var newEntity = {};

            _.each(allowedFields, function (allowedField) {

                if (_.has(entity, allowedField)) {

                    newEntity[allowedField] = entity[allowedField];
                }
            });

            entity = newEntity;
        }

        var old_entity = EstateObjects.findOne(_id);

        // Update record
        EstateObjects.update({'_id': _id}, {$set: entity}, function (error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', error.reason);
            }

            if (Meteor.isServer) {

                entity = _.extend(entity, {
                    '_id': _id
                });

                EventDispatcher.emit('onObjectSave', {
                    data: {
                        'isNew': false,
                        'entity': entity,
                        'old_entity': old_entity
                    }
                });
            }
        });

        return {
            'status': 'note',
            'result': 1
        };
    },

    'estateobjectArchive': function (_id) {


        check(Meteor.userId(), String);

        var loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'estateobjects', 'edit');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }

        // Clean _id
        check(_id, String);

        _id = YaFilter.clean({
            source: s(_id).trim().value(),
            type: 'AlNum'
        });


        // Update record
        EstateObjects.update({_id: _id}, {$set: {estateobjectStatus: 'archive', 'modifyDate': new Date()}}, function(error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', 'Ошибка при сохранении.');
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onObjectArchive', {
                    data: {
                        '_id': _id
                    }
                });
            }
        });


        return {
            'status': 'note',
            'result': 1
        };
    },

    'estateobjectActive': function (_id) {


        check(Meteor.userId(), String);

        var loggedInUser = Meteor.user();

        var isAllowed = Acl.isAllowed(loggedInUser._id, 'estateobjects', 'edit');

        if (!isAllowed) {

            throw new Meteor.Error('Error', 'Permission denied');
        }

        // Clean _id
        check(_id, String);

        _id = YaFilter.clean({
            source: s(_id).trim().value(),
            type: 'AlNum'
        });


        // Update record
        EstateObjects.update({_id: _id}, {$set: {estateobjectStatus: 'active', 'modifyDate': new Date()}}, function(error, docs) {

            if (error) {

                // display the error to the user
                throw new Meteor.Error('Error', 'Ошибка при сохранении.');
            }

            if (Meteor.isServer) {

                EventDispatcher.emit('onObjectActive', {
                    data: {
                        '_id': _id
                    }
                });
            }
        });


        return {
            'status': 'note',
            'result': 1
        };
    }
});
