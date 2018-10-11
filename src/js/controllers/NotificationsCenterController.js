var NotificationsCenterController = function(element, templateName) {
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._render();

    this._memberNumber="40802112";
    window.arrayNotificationsId=[]
    console.log(GrapQLClientType.APOLLO);
    this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.APOLLO);
    this._schemas=GraphQLQueries;

    this._loadNotificationsCounter();
    this._loadHeader();
    this._loadNotifications();

}

NotificationsCenterController.prototype._render = function() {
    this._element.html(this._template());
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

            //TODO implement parse
            var notificationsNewModel = result.data.notifications.notificationsNew;
            console.log("NEW")
            console.log(notificationsNewModel);
            self._notificationsHistoryController = new NotificationsController(
                $("#notificationsNew"),
                'notification-list-new-content',
                notificationsNewModel,
                'NEW',
                5
            );

            var notificationsHistoryModel = result.data.notifications.notificationsHistory;
            console.log("HISTORY")
            console.log(notificationsHistoryModel)
            self._notificationsNewController = new NotificationsController(
                $("#notificationsHistory"),
                'notification-list-history-content',
                notificationsHistoryModel,
                'HISTORY',
                4
            );

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

// NotificationsCenterController.prototype._loadNotifications = function(type) {

// }


