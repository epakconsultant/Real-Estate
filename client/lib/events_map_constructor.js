EventsMapConstructor = function (name, dataArr, requiredFields, isNew) {

	return {

		'click .save-btn': function (e) {

			var entity,
				haveErrors,
				errors,
				btnName,
				entityId;

			e.preventDefault();

    		$('.invalid').removeClass('invalid');


    		entity = YaRequest.getVars(dataArr);


    		haveErrors = false;
    		errors = [];


    		if (requiredFields && _.isArray(requiredFields) && requiredFields.length) {

    			_.each(requiredFields, function (element) {

    				if (element.intVal) {

    					if (!(+entity[element.fieldName])) {

    						haveErrors = true;

        					errors.push(element.fieldName);
    					}
    				} else {

    					if (!entity[element.fieldName]) {

    						haveErrors = true;

        					errors.push(element.fieldName);
    					}
    				}
    			});
    		}


    		if (haveErrors) {

		        _.each(errors, function (element) {

		            $('#' + element).addClass('invalid');
		        });

		        showNotice('error', 'Некорректно заполнены поля.'); // ToDo - Add multulanguage support (Yackovlev)

		        return;
		    }


		    btnName = $(e.target).attr('id');

		    if (isNew) {

		    	Meteor.call(name + 'Insert', entity, function (error, result) {

			        // Show error and exit
			        if (error) {

			            showNotice('error', 'Ошибка при сохранении.');
			            return;
			        }

			        showNotice('note', 'Запись сохранена');

			        if (btnName === 'saveBtn') {

			            Router.go(name, {_id: result._id});
			        } else if (btnName === 'saveAndCloseBtn') {

			            Router.go(YaUtilities.toPlural(name));
			        } else if (btnName === 'saveAndCreateBtn') {

			            Router.go(name + 'New');
			        }

			    });
		    } else {

		    	entityId = this._id;

		        Meteor.call(name + 'Update', entityId, entity, function (error) {

		            // Show error and exit
		            if (error) {

		                showNotice('error', 'Ошибка при сохранении.');
		                return;
		            } else {

		                showNotice('note', 'Запись сохранена');

			            if (btnName === 'saveBtn') {

			                Router.go(name, {_id: entityId});
			            } else if (btnName === 'saveAndCloseBtn') {

			                Router.go(YaUtilities.toPlural(name));
			            } else if (btnName === 'saveAndCreateBtn') {

			                Router.go(name + 'New');
			            }
		            }
		        });
		    }
		}
	}
};
