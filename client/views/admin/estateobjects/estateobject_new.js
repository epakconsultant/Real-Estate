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

Template.estateobjectNew.helpers({

    'wallstypes': function () {

        return Wallstypes.find();
    },

    'cityblocks': function () {

        var loggedInUser = Meteor.user();

        return CityBlocks.find({}, {
            'sort': {
                'cityBlockNumber': 1
            }
        });
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

        var currentDate = new Date();

        var currentYear = currentDate.getYear() + 1900 + 4;

        var yearRange = _.range(currentYear, 1960, -1);

        var yearsToReturn = [];

        _.each(yearRange, function (element) {

            yearsToReturn.push({'year': element});
        });

        return yearsToReturn;
    },

    'quartals': function () {

        return [
            {
                'quartal': 1,
                'text': '1 кв.'
            },
            {
                'quartal': 2,
                'text': '2 кв.'
            },
            {
                'quartal': 3,
                'text': '3 кв.'
            },
            {
                'quartal': 4,
                'text': '4 кв.'
            }
        ];
    }
});

Template.estateobjectNew.rendered = function() {
    $.getScript('https://api-maps.yandex.ru/2.1/?lang=ru_RU', function (data, textStatus, jqxhr) {

        ymaps.ready(init);

        var loggedInUser = Meteor.user();

        var city_id = loggedInUser.city_id;

        var city = Cities.findOne(city_id);

        function init () {

            $('#map-wrapper').css({
                'height': '300px'
            });
           
            myMap = new ymaps.Map('map-wrapper', {
              
                center: [city.coordX,city.coordY], // Ярославль. Добавить к cities координаты.
                zoom: 16,
            
                type: 'yandex#map'
            });

            var myPlacemark = new ymaps.Placemark([city.coordX,city.coordY], {}, {
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

                    var myGeoCoder = ymaps.geocode('Россия ' + city.cityName + ' ' + street + ' ' + houseNumber);

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

                    var myGeoCoder = ymaps.geocode('Pakistan ' + city.cityName + ' ' + street + ' ' + houseNumber);

                    myGeoCoder.then(
                        function (res) {

                            var resCoords = res.geoObjects.get(0).geometry.getCoordinates();

                            myPlacemark.geometry.setCoordinates(resCoords);

                            myMap.panTo(resCoords);
                            coords = resCoords;
                        },
                        function (err) {

                            showNotice('error', 'The error in determining the coordinates of the mark.');
                        }
                    );
                }
            });
        }
    });

    var uploadedImages = this.uploadedImages || [];
    uploadedImagesArr.set(uploadedImages);

    /*$.datetimepicker.setLocale('ru');
    $('#dateOfOpening').datetimepicker({
        timepicker:false,
        format:'d.m.Y',
        dayOfWeekStart: 1
    });*/

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
};

Template.estateobjectNew.onDestroyed(function() {

    tinymce.EditorManager.execCommand('mceRemoveEditor',true, 'desc');

    /*if (player && player.destroy && _.isFunction(player.destroy)) {

        player.destroy();
    }

    if (playerThumb && playerThumb.destroy && _.isFunction(playerThumb.destroy)) {

        playerThumb.destroy();
    }*/
});

Template.estateobjectNew.events({

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

        Meteor.call('estateobjectInsert', entity, function (error, result) {

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

                    Router.go('estateobject', {_id: result._id});
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
