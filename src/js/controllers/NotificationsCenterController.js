var NotificationsCenterController = function() {
    console.log(GrapQLClientType.APOLLO);
    this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.APOLLO);
    this._loadNotificationsCounter();
    this._loadHeader();
    this._loadNotifications();
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

    var subscriptionQuery = "";
    this._gqlClient.subscribe(subscriptionQuery)
        .subscribe({
            next(data) {
                console.log("NEW LINK");
                console.log(data);
                //alert("Notification: " + data.newNotification.mutation);

                // Notify your application with the new arrived data
                if (data.newNotification.mutation == 'CREATED') {
                    self._notificationsCountController.increase();
                } else {
                    self._notificationsCountController.decrease();
                }
            }
        });
}

NotificationsCenterController.prototype._loadHeader = function() {
    this._notificationsHeaderController = new NotificationsHeaderController(
        $("#notificationsHeader"),
        'notifications-header');

}

NotificationsCenterController.prototype._loadNotifications = function() {

    this._newNotifications = new NotificationsController(
        $("#notificationsNew"), 
        'notification-list'
    )


}

NotificationsCenterController.prototype.loadNotifications = function(type) {

}
