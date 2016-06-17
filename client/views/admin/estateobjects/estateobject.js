var uploadedImagesArr = new ReactiveVar([]);
var planningsArr = new ReactiveVar([]);
var coords = null;
var player;
var playerThumb;

Deps.autorun(function() {
    return uploadedImagesArr;
});

Deps.autorun(function() {
    return planningsArr;
});

Template.estateobject.helpers({

    'cityName': function () {

        var loggedInUser = Meteor.user();

        if (loggedInUser) {

            return Cities.findOne({
                '_id': loggedInUser.city_id
            }).cityName;
        }

        return '';
    },

    'wallstypes': function () {

        var loggedInUser,
            wallstypes,
            that;


        that = this;


        wallstypes = Wallstypes.find().fetch();

        _.each(wallstypes, function (value) {

            if (value._id == that.wallstype_id) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return wallstypes;
    },

    'cityblocks': function () {

        var loggedInUser,
            cityblocks,
            that;


        that = this;


        loggedInUser = Meteor.user();


        cityblocks = CityBlocks.find().fetch();

        _.each(cityblocks, function (value) {

            if (value._id == that.cityblock_id) {

                _.extend(value, {
                    'ifSelected': 'selected'
                });
            } else {

                _.extend(value, {
                    'ifSelected': ''
                });
            }
        });

        return cityblocks;
    },

    'uploadedImagesArr': function () {

        return uploadedImagesArr.get();
    },

    'planningsArr': function () {

        return planningsArr.get();
    },

    'myCallbacks': function() {

        return {

            'finished': function(index, fileInfo, context) {

                var currImages = uploadedImagesArr.get();
                currImages.push({'name': fileInfo.name, 'subDirectory': fileInfo.subDirectory});
                uploadedImagesArr.set(currImages);
            }
        }
    },

    'planningsCallbacks': function() {

        return {

            'finished': function(index, fileInfo, context) {

                var currImages = planningsArr.get();
                currImages.push({'name': fileInfo.name, 'subDirectory': fileInfo.subDirectory});
                planningsArr.set(currImages);
            }
        }
    },

    'cityName': function () {

        var loggedInUser = Meteor.user();

        if (loggedInUser) {

            return Cities.findOne({
                '_id': loggedInUser.city_id
            }).cityName;
        }

        return '';
    },

    'isMapCorrect': function () {

        var checked = '';

        if (this.isMapCorrect) {

            checked = 'checked';
        }

        return checked;
    },

    'isCar': function () {

        var checked = '';

        if (this.isCar) {

            checked = 'checked';
        }

        return checked;
    },

    'isCommerce': function () {

        var checked = '';

        if (this.isCommerce) {

            checked = 'checked';
        }

        return checked;
    },

    'specificFormData': function () {

        var id = this._id || YaFilter.clean({
            'source': s(Meteor.uuid()).trim().value(),
            'type': 'AlNum'
        });

        return {
          'id': id
        }
    },

    'years': function () {

        var that = this;

        var currentDate = new Date();

        var currentYear = currentDate.getYear() + 1900 + 4;

        var yearRange = _.range(currentYear, 1960, -1);

        var yearsToReturn = [];

        _.each(yearRange, function (element) {

            if (that.yearOfEnd === element) {

                yearsToReturn.push({'year': element, 'ifSelected': 'selected'});
            } else {

                yearsToReturn.push({'year': element});
            }

        });

        return yearsToReturn;
    },

    'quartals': function () {

        var quartals = [];

        for (var i = 1, j = 5; i < j; i++) {

            if (i === this.quartalOfEnd) {

                quartals.push({
                    'quartal': i,
                    'text': i.toString() + ' кв.',
                    'ifSelected': 'selected'
                });
            } else {

                quartals.push({
                    'quartal': i,
                    'text': i.toString() + ' кв.'
                });
            }
        }

        return quartals;
    },

    'styleQuartal': function () {

        if (this.category === 'oldbuild') {

            return 'display: none;';
        } else {

            return 'display: block;';
        }
    },

    'newbuild': function () {

        if (this.category === 'oldbuild') {

            return false;
        } else {

            return true;
        }
    },

    'category': function () {

        var category = [];

        if (this.category === 'oldbuild') {

            category = [
                {
                    'id': 'newbuild',
                    'text': 'Новостройка',
                    'ifSelected': ''
                },
                {
                    'id': 'oldbuild',
                    'text': 'Вторичное жилье',
                    'ifSelected': 'selected'
                }
            ];
        } else {

            category = [
                {
                    'id': 'newbuild',
                    'text': 'Новостройка',
                    'ifSelected': 'selected'
                },
                {
                    'id': 'oldbuild',
                    'text': 'Вторичное жилье',
                    'ifSelected': ''
                }
            ];
        }

        return category;
    }
});

Template.estateobject.rendered = function() {

    coords = this.data.coords;

    var currCity = Cities.findOne(this.data.city_id);

    if (!_.isArray(coords) || coords.length === 0) {
        coords = [currCity.coordX,currCity.coordY];
    }

    var cityName = this.data.cityName;

    $.getScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', function (data, textStatus, jqxhr) {

        ymaps.ready(init);

        function init () {

            $('#map-wrapper').css({
                'height': '300px'
            });

            // Создание экземпляра карты и его привязка к контейнеру с
            // заданным id ("map").
            myMap = new ymaps.Map('map-wrapper', {
                // При инициализации карты обязательно нужно указать
                // её центр и коэффициент масштабирования.
                center: coords,
                zoom: 16,
                // Тип покрытия карты: "Карта".
                type: 'yandex#map'
            });

            var myPlacemark = new ymaps.Placemark(coords, {}, {
                'draggable': true
            });

            myPlacemark.events.add('dragend', function (e) {

                var resCoords = e.get('target').geometry.getCoordinates();

                myMap.panTo(resCoords);
                coords = resCoords;
            });

            myMap.geoObjects.add(myPlacemark);

            $('#street').blur(function (event) {


                var houseNumber = s($('#houseNumber').val()).trim().value();

                event.preventDefault();

                var street = s($(this).val()).trim().value();


                if (street) {

                    var myGeoCoder = ymaps.geocode('Россия ' + currCity.cityName + ' ' + street + ' ' + houseNumber);

                    myGeoCoder.then(
                        function (res) {

                            var resCoords = res.geoObjects.get(0).geometry.getCoordinates();

                            myPlacemark.geometry.setCoordinates(resCoords);

                            myMap.panTo(resCoords);
                            coords = resCoords;
                        },
                        function (err) {

                            showNotice('error', 'Ошибка при определении координат метки.');
                        }
                    );
                }
            });

            $('#houseNumber').blur(function (event) {


                var houseNumber = s($(this).val()).trim().value();

                event.preventDefault();

                var street = s($('#street').val()).trim().value();


                if (street) {

                    var myGeoCoder = ymaps.geocode('Россия ' + currCity.cityName + ' ' + street + ' ' + houseNumber);

                    myGeoCoder.then(
                        function (res) {

                            var resCoords = res.geoObjects.get(0).geometry.getCoordinates();

                            myPlacemark.geometry.setCoordinates(resCoords);

                            myMap.panTo(resCoords);
                            coords = resCoords;
                        },
                        function (err) {

                            showNotice('error', 'Ошибка при определении координат метки.');
                        }
                    );
                }
            });
        }
    });

    var uploadedImages = this.data.uploadedImages || [];
    uploadedImagesArr.set(uploadedImages);

    var planningsImages = this.data.planningsImages || [];
    planningsArr.set(planningsImages);

    tinymce.init({
        selector: '#desc',
        toolbar: [
            'undo redo | bold italic underline | cut copy paste removeformat | code fullscreen preview',
            'styleselect | alignleft aligncenter alignright alignjustify | bullist numlist | table anchor link'
        ],
        menubar: false,
        height: 300,
        language: 'ru',
        theme: 'modern',
        plugins: 'code anchor fullscreen link lists paste table wordcount',
        paste_as_text: true,
        mode : "specific_textareas",
        editor_selector : "mceEditor"
    });


    $("a.gallery").fancybox({
		'transitionIn'	:	'elastic',
		'transitionOut'	:	'elastic',
		'speedIn'		:	600,
		'speedOut'		:	200,
		'overlayShow'	:	false
	});

    var videoThumb_id = YaUtilities.parseYouTubeLink($('#thumbVideo').val());

    /*if (playerThumb && playerThumb.destroy && _.isFunction(playerThumb.destroy)) {

        playerThumb.destroy();
    }*/

    var video_id = YaUtilities.parseYouTubeLink($('#fullVideo').val());

    if (!(video_id || videoThumb_id)) {

        return;
    }

    /*if (player && player.destroy && _.isFunction(player.destroy)) {

        player.destroy();
    }*/

    onYouTubeIframeAPIReady = function () {

        if (videoThumb_id) {

            playerThumb = new YT.Player('playerThumb', {
                height: '300',
                width: '520',
                videoId: videoThumb_id,
            });
        }

        if (video_id) {
            player = new YT.Player('player', {
                height: '300',
                width: '520',
                videoId: video_id,
            });
        }
    };

    YT.load();
};

Template.estateobject.onDestroyed(function() {

    tinymce.EditorManager.execCommand('mceRemoveEditor',true, 'desc');

    /*if (player && player.destroy && _.isFunction(player.destroy)) {

        player.destroy();
    }

    if (playerThumb && playerThumb.destroy && _.isFunction(playerThumb.destroy)) {

        playerThumb.destroy();
    }*/
});

Template.estateobject.events({

    'click .save-btn': function (e) {

        var entity,
            haveErrors = false,
            errors = [];


        $('.invalid').removeClass('invalid');

        e.preventDefault();

        entity = {

            'objectName': $.trim(YaRequest.getString('objectName', '', 'INPUT')), // required

            'cityblock_id': YaRequest.getAlnum('cityblock_id', '', 'INPUT'), // required

            'street': $.trim(YaRequest.getString('street', '', 'INPUT')), // required

            'houseNumber': $.trim(YaRequest.getString('houseNumber', '', 'INPUT')),

            'corpNumber': $.trim(YaRequest.getString('corpNumber', '', 'INPUT')),

            'strNumber': $.trim(YaRequest.getString('strNumber', '', 'INPUT')),

            'isMapCorrect': YaRequest.getBool('isMapCorrect', false, 'SELECT'),

            'category': YaRequest.getWord('category', '', 'INPUT'), // required - newbuild || oldbuild

            'yearOfEnd': +$.trim(YaRequest.getInt('yearOfEnd', '', 'INPUT')), // required - 1960 : current + 4

            'quartalOfEnd': +$.trim(YaRequest.getInt('quartalOfEnd', '', 'INPUT')), // required, if new build, else 0 - 0,1,2,3,4

            'wallstype_id': YaRequest.getAlnum('wallstype_id', '', 'INPUT'), // required

            'floority': +$.trim(YaRequest.getInt('floority', '', 'INPUT')), // required

            'isCar': YaRequest.getBool('isCar', false, 'SELECT'),

            'isCommerce': YaRequest.getBool('isCommerce', false, 'SELECT'),

            'uploadedImages': uploadedImagesArr.get(),

            'planningsImages': planningsArr.get(),

            'thumbVideo': YaUtilities.parseYouTubeLink($('#thumbVideo').val()),

            'fullVideo': YaUtilities.parseYouTubeLink($('#fullVideo').val()),

            'shops': $.trim(YaRequest.getString('shops', '', 'INPUT')),

            'tradeCenters': $.trim(YaRequest.getString('tradeCenters', '', 'INPUT')),

            'kindergardens': $.trim(YaRequest.getString('kindergardens', '', 'INPUT')),

            'schools': $.trim(YaRequest.getString('schools', '', 'INPUT')),

            'medicCenters': $.trim(YaRequest.getString('medicCenters', '', 'INPUT')),

            'joyCenters': $.trim(YaRequest.getString('joyCenters', '', 'INPUT')),

            'transport': $.trim(YaRequest.getString('transport', '', 'INPUT')),

            'desc': YaFilter.clean({
                'source': s(tinyMCE.get('desc').getContent()).trim().value(),
                'type': 'Html'
            }), // purifier needed without filter

            'coords': coords
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

        if (!entity.floority) {

            errors.push('floority');
            haveErrors = true;
        }

        if (haveErrors) {

            _.each(errors, function (element) {

                $('#' + element).addClass('invalid');
            });

            showNotice('error', 'Некорректно заполнены поля.'); // ToDo - Add multulanguage support (Yackovlev)

            return;
        }

        var btnName = $(e.target).attr('data-id');
        entityId = this._id;

        Meteor.call('estateobjectUpdate', entityId, entity, function (error, result) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при сохранении.');
                return;
            } else {


               if (result && result.status == 'error') {

                    showNotice('error', 'Ошибка при сохранении.');
                    return;
                }

                showNotice('note', 'Запись сохранена');

                if (btnName === 'saveBtn') {

                    //Router.go('estateobject', {_id: result._id});
                } else if (btnName === 'saveAndCloseBtn') {

                    if (history && history.length > 1) {

                        history.back();
                    } else {

                        Router.go('estateobjects');
                    }
                } else if (btnName === 'saveAndCreateBtn') {

                    Router.go('estateobjectNew');
                }
            }
        });
    },

    'click .backBtn': function (e) {

        e.preventDefault();

        if (history && history.length > 1) {

            history.back();
        } else {

            Router.go('estateobjects');
        }
    },

    'click .tabs-controls': function (e) {

        e.preventDefault();

        var currentTarget = $(e.target);

        if (currentTarget.hasClass('active-tab')) {

            return;
        }

        $('.active-tab').removeClass('active-tab');
        currentTarget.addClass('active-tab');

        var currentTargetId = currentTarget.attr('id');

        if (currentTargetId === 'newbuild') {

            $('#quartalOfEndWrap').css({
                'display': 'block'
            });

            $("#category").val('newbuild');
        } else {

            $('#quartalOfEndWrap').css({
                'display': 'none'
            });

            $("#category").val('oldbuild');
        }

        return;
    },

    'blur #thumbVideo': function (e) {

        e.preventDefault();

        var video_id = YaUtilities.parseYouTubeLink($('#thumbVideo').val());

        if (!video_id || video_id === this.thumbVideo) {

            return;
        }

        if (playerThumb && playerThumb.destroy && _.isFunction(playerThumb.destroy)) {

            playerThumb.destroy();
        }

        onYouTubeIframeAPIReady = function () {

            playerThumb = new YT.Player('playerThumb', {
                height: '300',
                width: '520',
                videoId: video_id,
            });
        };

        YT.load();
    },

    'blur #fullVideo': function (e) {

        e.preventDefault();

        var video_id = YaUtilities.parseYouTubeLink($('#fullVideo').val());

        if (!video_id || video_id === this.fullVideo) {

            return;
        }

        if (player && player.destroy && _.isFunction(player.destroy)) {

            player.destroy();
        }

        onYouTubeIframeAPIReady = function () {

            player = new YT.Player('player', {
                height: '300',
                width: '520',
                videoId: video_id,
            });
        };

        YT.load();
    },

    'click a.gallery': function (e) {

        e.preventDefault();
    }
});

Template.uploadedImagesArrItem.events({

    'click .deleteLink': function (e) {

        e.preventDefault();

        var directory = this.subDirectory;
        var name = this.name;

        Meteor.call('deleteImg', directory, name, function (err, obj) {

            if (err) {

                showNotice('error', 'Ошибка при удалении изображения.');
                return;
            }

            showNotice('note', 'Изображение удалено.');

            var currImages = uploadedImagesArr.get();

            currImages = _.reject(currImages, function (img) {

                if (img.name === name && img.subDirectory === directory) {

                    return true;
                }

                return false;
            });

            uploadedImagesArr.set(currImages);

            return;
        });
    }
});
