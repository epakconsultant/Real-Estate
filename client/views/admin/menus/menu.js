Template.menu.events({

	'click #showMenu': function (event) {

		event.preventDefault();

		if ($(event.currentTarget).hasClass('active-show')) {

			$(event.currentTarget).removeClass('active-show');
			$('#menu-wrapper').removeClass('active-menu');
		} else {

			$(event.currentTarget).addClass('active-show');
			$('#menu-wrapper').addClass('active-menu');
		}
	},

	'click .menu a': function (event) {

		$('#showMenu').removeClass('active-show');
		$('#menu-wrapper').removeClass('active-menu');
	}
})