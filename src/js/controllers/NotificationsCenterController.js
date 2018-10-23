var NotificationsCenterController = function(element, templateName) {
    this._subscriptions = [];
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._render();

    this._memberNumber= window.MEMBER_NUMBER;
    // this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.APOLLO);
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
    
    //TODO remove after adpting apollo client
    //var query = this._schemas.queryNotifications();
    
    var query = GraphQLQueriesAmplify.QUERIES.NOTIFICATIONS;
    var variables = {
        memberNumber: MEMBER_NUMBER,
        limitNew: PaginationStructureHelper.SIZE_LIMIT_LIST_NEW,
        limitHistory: PaginationStructureHelper.SIZE_LIMIT_LIST_HISTORY
    };
    this._gqlClient
        .query(query, variables)
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
                'New',
                PaginationStructureHelper.LIST_NEW_ITEMS_PER_PAGE
            );

            var notificationsHistoryModel = result.data.notifications.notificationsHistory;
            self._notificationsHistoryController = new NotificationsController(
                $("#notificationsHistory"),
                'notification-list-history-content',
                notificationsHistoryModel,
                'History',
                PaginationStructureHelper.LIST_HISTORY_ITEMS_PER_PAGE
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

    //TODO remove after adpting apollo client
    //var subscriptionQuery = this._schemas.subscribeNewNotification(this._memberNumber);
    
    var subscriptionQuery = GraphQLQueriesAmplify.SUBSCRIPTIONS.NEW_NOTIFICATIONS;
    var variables = { memberNumber: MEMBER_NUMBER };
    var newNotificationSubscription =  this._gqlClient.subscribe(subscriptionQuery, variables)
        .subscribe({
            next(data) {
                console.log("NEW NOTIFICATION");
                console.log(data);
                //alert("Notification: " + data.newNotification.mutation);

                // Notify your application with the new arrived data
                self._notificationsCountController.increase();
                self._notificationsNewController.addNotifications([data.value.data.newNotification]);
            }
        });
    this._subscriptions.push(newNotificationSubscription);
}

NotificationsCenterController.prototype._subscribeToHistoryNotifications = function() {
    var self = this;

    //TODO remove after adpting apollo client
    //var subscriptionQuery = this._schemas.subscribeHistoryNotifications(this._memberNumber);
    
    var subscriptionQuery = GraphQLQueriesAmplify.SUBSCRIPTIONS.HISTORY_NOTIFICATIONS;
    var variables = { memberNumber: MEMBER_NUMBER };
    const historyNotificationSubscription = this._gqlClient.subscribe(subscriptionQuery, variables)
        .subscribe({
            next(data) {
                console.log("MOVE TO HISTORY");
                console.log(data);
                //alert("Notification: " + data.newNotification.mutation);
                var notifications = data.value.data.historyNotifications.notifications;
                
                // Notify your application with the new arrived data
                self._notificationsCountController.decrease(notifications.length);
                self._notificationsNewController.removeNotifications(notifications);
                self._notificationsHistoryController.addNotifications(notifications);
            }
        });
    this._subscriptions.push(historyNotificationSubscription);
}

NotificationsCenterController.prototype._loadHeader = function() {
    this._notificationsHeaderController = new NotificationsHeaderController(
        $("#notificationsHeader"),
        'notifications-header');
}


