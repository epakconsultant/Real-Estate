Template.searchBox.events({

	'click #to-black-list': function (event) {

		var phone;

		event.preventDefault();


		$('#search-phone').removeClass('invalid');
        $('#search-info-text').html('');
        $('#search-info').removeClass('visible-info');


		phone = $('#search-phone').val();

		// Clear phone string
		phone = YaFilter.clean({
            'source': s(phone).trim().value(),
            'type': 'Number'
        });

		if (!phone) {

			$('#search-phone').addClass('invalid');
			return;
		}

        Meteor.call('addToBlackList', phone, function (error, result) {

            if (error) {

                showNotice('error', 'Ошибка при добавлении в черный список.');
                return;
            } else {

                if (result) {

                	showNotice(result.status, result.message);
                    return;
                } else {

                	showNotice('error', 'Неизвестная ошибка при добавлении в черный список.');
                    return;
                }
            }
        });
	},

	'click #from-black-list': function (event) {

		var phone;

		event.preventDefault();


		$('#search-phone').removeClass('invalid');

		phone = $('#search-phone').val();

		// Clear phone string
		phone = YaFilter.clean({
            'source': s(phone).trim().value(),
            'type': 'Number'
        });

		if (!phone) {

			$('#search-phone').addClass('invalid');
			return;
		}

        Meteor.call('removeFromBlackList', phone, function (error, result) {

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при удалении из черного списка.');
                return;
            } else {

                if (result) {

                	showNotice(result.status, result.message);
                    return;
                } else {

                	showNotice('error', 'Неизвестная ошибка при удалении из черного списка.');
                    return;
                }
            }
        });
	},

	'submit #ya-top-search-box-form': function (event) {

		var phone;

		event.preventDefault();


        $('#search-info-text').html('');
        $('#search-info').removeClass('visible-info');
		$('#search-phone').removeClass('invalid');


		phone = $('#search-phone').val();

		// Clear phone string
		phone = YaFilter.clean({
            'source': s(phone).trim().value(),
            'type': 'Number'
        });

		if (!phone) {

			$('#search-phone').addClass('invalid');
			return;
		}


        phone = phone.toString();


        var setCharAt = function (str,index,chr) {

            if(index > str.length-1) {

                return str;
            }

            return str.substr(0,index) + chr + str.substr(index+1);
        };


        if (phone.length >= 12 || phone.length < 3) {

            $('#search-phone').addClass('invalid');
            return;
        }

        if (phone.length == 11) {

            if (phone.charAt(0) == '8') {

                phone = setCharAt(phone, 0, '7');
            }

            if (phone.charAt(0) != '7') {

                $('#search-phone').addClass('invalid');
                return;
            }

            if (phone.charAt(1) != '9' && phone.charAt(1) != '4') {

                $('#search-phone').addClass('invalid');
                return;
            }
        }

        

        Meteor.call('searchPhone', phone, function (error, result) {

            var html;

            if (error) {

                // display the error to the user
                showNotice('error', 'Ошибка при поиске.');
                return;
            } else {

                if (result && result.status) {

                    if (result.status == 'error') {

                        $('#search-phone').addClass('invalid');
                        return;
                    }

                    var counter = 1;
                    html = '';

                    _.each(result.searchResults, function (element, index) {
                        
                        html += '<span class="search-result-info-wrapp">';
                        if (element.phone) {

                            html += '<span class="result-info">' + counter + '. ' + element.phone + ' <span class="ya-search-message">' + element.message + '</span></span>';
                        } else {

                            html += '<span class="result-info">' + counter + '. ' + phone + ' <span class="ya-search-message">' + element.message + '</span></span>';
                            html = html + '<a href="/newestateobject?phone=' + phone + '" class="result-url">Создать объект</a>'
                        }

                        if (element.url) {

                            html = html + '<a href="' + element.url + '" class="result-url" target="_blank">Перейти</a>'
                        }

                        html += '</span>';
                        counter++;
                    });

                    

                	$('#search-info-text').html(html);
                    $('#search-info').addClass('visible-info');
                } else {

                	showNotice('error', 'Неизвестная ошибка при поиске.');
                    return;
                }
            }
        });
	},

    'click #close-search-info': function (event) {

        event.preventDefault();

        $('#search-info-text').html('');
        $('#search-info').removeClass('visible-info');
        $('#search-phone').removeClass('invalid');
        $('#search-phone').val('');
    },

    'click .result-url': function () {

        $('#search-info-text').html('');
        $('#search-info').removeClass('visible-info');
        $('#search-phone').removeClass('invalid');
        $('#search-phone').val('');
    }
});