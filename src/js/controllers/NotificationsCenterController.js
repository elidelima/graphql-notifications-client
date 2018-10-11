var NotificationsCenterController = function(element, templateName) {
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._render();

    this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.APOLLO);
    //this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.AMPLIFY);
    this._loadNotificationsCounter();
    this._loadHeader();
    this._loadNotifications();
}

NotificationsCenterController.prototype._render = function() {
    this._element.html(this._template());
}

NotificationsCenterController.prototype._loadNotificationsCounter = function() {
    var self = this;
    //var query = 'query { notifications(memberNumber:"1234") { id } } ';
    //notifications(memberNumber:"123",limitNew: 25, limitHistory:50) {
    var query = `query notifications {
        notifications(limitNew: 25, limitHistory:50) {
            notificationsNew{
                notifications{
                    id
                    memberNumber
                    detail{
                        code
                        description
                        action
                    }
                }
                nextToken
            }
            notificationsHistory{
                notifications{
                    id
                    memberNumber
                    detail{
                        code
                        description
                        action
                    }
                }
                nextToken
            }
            newNotificationCount
            hasMoreNewNotification
        }
    }` 

    this._gqlClient.query(query)
        .then(function(result) {

            console.log(result);

            var counterModel = new NotificationCount(result.data.notifications.newNotificationCount);
            //var counterModel = new NotificationCount(result.data.notifications.length);
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
            console.log(error);
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

//@deprecated
NotificationsCenterController.prototype._loadNotifications = function() {
    /*
    this._newNotifications = new NotificationsController(
        $("#notificationsNew"), 
        'notification-list'
    )*/
}

