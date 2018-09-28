var NotificationsCenterController = function() {
    console.log(GrapQLClientType.APOLLO);
    this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.APOLLO);
    this._loadNotificationsCounter();
}

NotificationsCenterController.prototype._loadNotificationsCounter = function() {

    var self = this;

    var query = 'query { notifications(memberNumber:"1234") { id } } ';

    this._gqlClient.query(query)
        .then(function(result) {
            var model = new NotificationCount(result.data.notifications.length);
            self._notificationsCountController = new NotificationsCountController(
                $("#notificationsCounter"),
                'notifications-counter',
                model
            );
        })
        .catch(function(error) {
            console.log("error loading counter for notifications")
        });
}

NotificationsCenterController.prototype.loadPage = function() {

}

NotificationsCenterController.prototype.loadNotifications = function(type) {

}

$(document).ready(function () {
    console.log("Load NotificationsCenterController");
    window.notificationsCenterController = new NotificationsCenterController();
});
