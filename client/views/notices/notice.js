Template.notice.events({

	'click .close': function (event) {

		event.preventDefault();

        id = $(event.target).parent().data('id');

		clearNotice(id);
		//console.log(this);
	}

});

/*Template.notice.rendered = function () {

	var notice = this.data;

	Meteor.defer(function () {

		Notices.update(notice._id, {$set: {seen: true}});
	});
};*/
