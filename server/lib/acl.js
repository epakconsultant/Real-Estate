// A child of the Acl class for publish methods.
// We need it because Meteor.userId() doesn't work in publication functions.
AclForPublish = function (userId) {

    this.userId = userId;
}

AclForPublish.prototype = new YaAcl();

AclForPublish.prototype.constructor = AclForPublish;

AclForPublish.prototype.getCurrentUserId = function () {

    return this.userId;
}
