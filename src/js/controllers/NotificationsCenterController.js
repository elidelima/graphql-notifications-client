var NotificationsCenterController = function(element, templateName) {
    this._subscriptions = [];
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._render();

    this._memberNumber= window.MEMBER_NUMBER;
    //this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.APOLLO);
    this._gqlClient = GraphQLClient.getGraphQLClient();
    this._schemas=GraphQLQueries;
    this._loadNotificationsCounter();
    this._loadHeader();
}

NotificationsCenterController.prototype._render = function() {
    this._element.html(this._template());
}

NotificationsCenterController.prototype._loadNotificationsCounter = function() {
    var self = this;

    var query = this._schemas.queryNotifications();
    this._gqlClient
        .query(query)
        .then(function(result) {
            // var counterModel = new NotificationCount(result.data.notifications.notificationsNew); //.notifications.length
            var counterModel = new NotificationCount(result.data.notifications.newNotificationCount);
            self._notificationsCountController = new NotificationsCountController(
                $("#notificationsCounter"),
                'notifications-counter',
                counterModel
            );

            //TODO implement parse
            var notificationsNewModel = result.data.notifications.notificationsNew;
            self._notificationsNewController = new NotificationsController(
                $("#notificationsNew"),
                'notification-list-new-content',
                notificationsNewModel,
                'NEW',
                3
            );

            var notificationsHistoryModel = result.data.notifications.notificationsHistory;
            self._notificationsHistoryController = new NotificationsController(
                $("#notificationsHistory"),
                'notification-list-history-content',
                notificationsHistoryModel,
                'HISTORY',
                4
            );

        })
        .catch(function(error) {
            console.log("error loading notifications centre")
            console.log(error)
        });

    
    this._subscribeToNewNotifications();
    
    this._subscribeToHistoryNotifications();
}

NotificationsCenterController.prototype._loadHeader = function() {
    this._notificationsHeaderController = new NotificationsHeaderController(
        $("#notificationsHeader"),
        'notifications-header');
}

NotificationsCenterController.prototype._destroy = function() {
    this._subscriptions.forEach(function(subscription){
        subscription.unsubscribe();
    });
}

NotificationsCenterController.prototype._subscribeToNewNotifications = function() {
    var self = this;
    var subscriptionQuery = this._schemas.subscribeNewNotification(this._memberNumber);
    console.log(subscriptionQuery.query)
    var newNotificationSubscription =  this._gqlClient.subscribe(subscriptionQuery)
        .subscribe({
            next(data) {
                console.log("NEW NOTIFICATION");
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
    this._subscriptions.push(newNotificationSubscription);
}

NotificationsCenterController.prototype._subscribeToHistoryNotifications = function() {
    var self = this;
    var subscriptionQuery = this._schemas.subscribeHistoryNotifications(this._memberNumber);
    console.log(subscriptionQuery.query)
    const historyNotificationSubscription = this._gqlClient.subscribe(subscriptionQuery)
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
    this._subscriptions.push(historyNotificationSubscription);
}



