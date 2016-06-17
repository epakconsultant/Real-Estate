Template.estateobjectListItem.helpers({

    'cityBlockName': function () {

        var cityblockItem = CityBlocks.findOne(this.cityblock_id);

        return cityblockItem.cityBlockName;
    },

    'typeOfEstateName': function () {

        var typeOfEstateItem = Typeofestates.findOne(this.typeofestate_id);

        return typeOfEstateItem.typeOfEstateName;
    },

    'wallstypeName': function () {

        var wallstypeItem = Wallstypes.findOne(this.wallstype_id);

        return wallstypeItem.wallsTypeName;
    },

    'categoryName': function () {

        var categoryName = 'Новостройка';

        if (this.category === 'oldbuild') {

            categoryName = 'Вторичное жилье';
        }

        return categoryName;
    },

    'isActiveObj': function () {

        if (this.estateobjectStatus === 'active') {

            return true;
        } else {

            return false;
        }
    }
});
