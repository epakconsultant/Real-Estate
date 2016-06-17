Template.clientListItem.helpers({

    'typeofeatates': function () {

    	var typeofeatates;

        typeofeatates = [];

        _.each(this.typeofestate_ids, function (typeofestate_id) {

        	var typeofeatatesItem;

            typeofeatatesItem = Typeofestates.findOne(typeofestate_id);

            typeofeatates.push({typeOfEstateName: typeofeatatesItem.typeOfEstateName});
        });

        
        return typeofeatates;
    },

    'isInBlackList': function () {

        if (BlackList.findOne({'phone': this.phone})) {

            return 'blacklist-item';
        }

        return 'normal-item';
    }
});