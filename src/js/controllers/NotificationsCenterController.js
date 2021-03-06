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
    this._loadNotifications();
    this._subscribeToNotificationsChange();
}

NotificationsCenterController.prototype._render = function() {
    this._element.html(this._template());
}

NotificationsCenterController.prototype._loadNotificationsCounter = function() {
    var self = this;
    
    var query = GraphQLQueriesAmplify.QUERIES.NOTIFICATIONS_NEW_COUNT;
    var variables = { memberNumber: MEMBER_NUMBER };
    this._gqlClient
        .query(query, variables)
        .then(function(result) {
            var counterModel = new NotificationCount(result.data.getNotificationNewCount.count);
            self._notificationsCountController = new NotificationsCountController(
                $("#notificationsCounter"),
                'notifications-counter',
                counterModel
            );
        })
        .catch(function(error) {
            console.log("error loading notifications centre")
            console.log(error)
        });
}


NotificationsCenterController.prototype._loadNotifications = function() {
    var self = this;
    var query = GraphQLQueriesAmplify.QUERIES.NOTIFICATIONS;
    var variables = {
        memberNumber: MEMBER_NUMBER,
        limitNew: PaginationStructureHelper.SIZE_LIMIT_LIST_NEW,
        limitHistory: PaginationStructureHelper.SIZE_LIMIT_LIST_HISTORY
    };
    this._gqlClient
        .query(query, variables)
        .then(function(response) {
            
            console.log(response);
            //TODO implement parse
            var notificationsNewModel = response.data.notifications.notificationsNew;
            self._notificationsNewController = new NotificationsController(
                $("#notificationsNew"),
                'notification-list-new-content',
                notificationsNewModel,
                'New',
                PaginationStructureHelper.LIST_NEW_ITEMS_PER_PAGE
            );
            

            var notificationsHistoryModel = response.data.notifications.notificationsHistory;
            self._notificationsHistoryController = new NotificationsController(
                $("#notificationsHistory"),
                'notification-list-history-content',
                notificationsHistoryModel,
                'History',
                PaginationStructureHelper.LIST_HISTORY_ITEMS_PER_PAGE
            );
            
            self._loadHeader();

        })
        .catch(function(error) {
            console.log("error loading notifications centre")
            console.log(error)
        });
    
}

NotificationsCenterController.prototype._destroy = function() {
    this._subscriptions.forEach(function(subscription){
        subscription.unsubscribe();
    });
}

NotificationsCenterController.prototype._loadHeader = function() {
    var notificationControllers = [
        this._notificationsNewController,
        this._notificationsHistoryController
    ]
    this._notificationsHeaderController = new NotificationsHeaderController(
        $("#notificationsHeader"),
        'notifications-header', 
        {},
        notificationControllers
    );
}

NotificationsCenterController.prototype._subscribeToNotificationsChange = function() {
    var self = this;    
    var subscriptionQuery = GraphQLQueriesAmplify.SUBSCRIPTIONS.NOTIFICATION_CHANGE;
    var variables = { memberNumber: MEMBER_NUMBER };
    var newNotificationSubscription =  this._gqlClient.subscribe(subscriptionQuery, variables)
        .subscribe({
            next:function next(response) {
                var notificationChange = response.value.data.notificationChange;
                if (notificationChange.type == "NEW") {
                    console.log("NEW Notifications");
                    console.log(notificationChange);
                    self._notificationsCountController.increase();
                    self._notificationsNewController.addNotifications(notificationChange.notifications);
                } else {
                    console.log("HISTORY Notifications");
                    console.log(notificationChange);
                    self._notificationsCountController.decrease(notificationChange.notifications.length);
                    self._notificationsNewController.removeNotifications(notificationChange.notifications);
                    self._notificationsHistoryController.addNotifications(notificationChange.notifications);
                }
            }
        });
    this._subscriptions.push(newNotificationSubscription);
}
