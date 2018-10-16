var NotificationsCenterController = function() {
    this._memberNumber="40802112";
    window.arrayNotificationsId=[]
    console.log(GrapQLClientType.APOLLO);
    this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.APOLLO);
    this._schemas=GraphQLQueries;
    this._loadNotificationsCounter();
    this._loadHeader();
    this._loadNotifications();
    this._loadFixedFooter();    

}

NotificationsCenterController.prototype._loadNotificationsCounter = function() {

    var self = this;

    var query = this._schemas.queryNotifications();
    this._gqlClient.query(query)
        .then(function(result) {
            console.log(result)
            // var counterModel = new NotificationCount(result.data.notifications.notificationsNew); //.notifications.length
            var counterModel = new NotificationCount(result.data.notifications.newNotificationCount);
            self._notificationsCountController = new NotificationsCountController(
                $("#notificationsCounter"),
                'notifications-counter',
                counterModel
            );

            self._notificationsNewController = new NotificationsController(
                $("#notificationsNew"),
                'notification-list-new',
                result.data.notifications.notificationsNew
            )

            self._notificationsHistoryController = new NotificationsController(
                $("#notificationsHistory"),
                'notification-list-history',
                result.data.notifications.notificationsHistory
            )

        })
        .catch(function(error) {
            console.log("error loading counter for notifications")
            console.log(error)
        });

    var subscriptionQuery = this._schemas.subscribeNewNotification(this._memberNumber);
    console.log(subscriptionQuery.query)
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

    var subscriptionQuery = this._schemas.subscribeHistoryNotifications(this._memberNumber);
    console.log(subscriptionQuery.query)
    this._gqlClient.subscribe(subscriptionQuery)
        .subscribe({
            next(data) {
                console.log("MOVE TO HISTORY");
                console.log(data);
                //alert("Notification: " + data.newNotification.mutation);

                // Notify your application with the new arrived data
                if (data.historyNotifications.mutation == 'UPDATED') {
                    self._notificationsCountController.decrease();
                } 
            }
        });

}

NotificationsCenterController.prototype._loadHeader = function() {
    this._notificationsHeaderController = new NotificationsHeaderController(
        $("#notificationsHeader"),
        'notifications-header');
        console.log("_loadHeader")
}

//@deprecated
NotificationsCenterController.prototype._loadNotifications = function() {
console.log("_loadNotifications")
    this._newNotifications = new NotificationsController(
        $("#notificationsNew"), 
        'notification-list'
    )
    const self=this
    $('#clicktest').click(function(){
        var mutation = self._schemas.moveToHistory(self._memberNumber,JSON.stringify(window.arrayNotificationsId));
        console.log(mutation)
        self._gqlClient.mutate(mutation)
            .then(function(result) {
                console.log("Moved to Notifications Successfully")
                console.log(result)
        
            })
            .catch(function(error) {
                console.log("error loading counter for notifications")
                console.log(error)
            });
    })

}

NotificationsCenterController.prototype._loadFixedFooter = function() {
    console.log("_load fixed footer")
    var fixedFooterModel = new NotificationFooter();
    this._fixedFooter = new NotificationsController(
        $("#notificationFooterFixed"), 
        'notifications-footer-fixed',
        fixedFooterModel
    )
}

// NotificationsCenterController.prototype._loadNotifications = function(type) {

// }


