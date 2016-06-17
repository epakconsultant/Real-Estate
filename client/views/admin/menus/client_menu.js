Template.clientMenu.helpers({

    'menuItems': function () {

        var menuItems = [];

        menuItems.push({
            'path': 'flats',
            'icon': 'fa-university',
            'title': 'Объекты',
            'isActive': ('flats' === Session.get('activeMenuItem')) ? true : false
        });

        menuItems.push({
            'path': 'featured',
            'icon': 'fa-star',
            'title': 'Избранное',
            'isActive': ('featured' === Session.get('activeMenuItem')) ? true : false
        });

        menuItems.push({
            'path': 'notifications',
            'icon': 'fa-envelope',
            'title': 'Настройки уведомлений',
            'isActive': ('notifications' === Session.get('activeMenuItem')) ? true : false
        });


        var currSub = Subscribtions.findOne({
            'endDate': {
                $gte: new Date()
            }
        });

        if (currSub) {
            
            var currSubInfo = 'активна';
        } else {

            var currSubInfo = 'неактивна';
        }

        menuItems.push({
            'path': 'subscribtions',
            'icon': 'fa-folder-open',
            'title': 'Моя подписка (' + currSubInfo + ')',
            'isActive': ('subscribtions' === Session.get('activeMenuItem')) ? true : false
        });

        menuItems.push({
            'path': 'orderNew',
            'icon': 'fa-cart-arrow-down',
            'title': 'Оформить подписку',
            'isActive': ('orderNew' === Session.get('activeMenuItem')) ? true : false
        });


        var payments = Payments.find().fetch();

        var balance = 0;

        _.each(payments, function (element) {

            balance += element.summ;
        });

        menuItems.push({
            'path': 'paymentslist',
            'icon': 'fa-money',
            'title': 'Баланс (' + balance + ' руб.)',
            'isActive': ('paymentslist' === Session.get('activeMenuItem')) ? true : false
        });

        menuItems.push({
            'path': 'checkout',
            'icon': 'fa-sign-in',
            'title': 'Пополнить баланс',
            'isActive': ('checkout' === Session.get('activeMenuItem')) ? true : false
        });


        return menuItems;
    }
});