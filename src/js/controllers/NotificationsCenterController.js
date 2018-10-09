var NotificationsCenterController = function() {
    console.log(GrapQLClientType.APOLLO);
    //this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.APOLLO);
    this._gqlClient = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.AMPLIFY);
    this._loadNotificationsCounter();
    this._loadHeader();
    this._loadNotifications();
}

NotificationsCenterController.prototype._loadNotificationsCounter = function() {

    var self = this;

    //var query = 'query { notifications(memberNumber:"1234") { id } } ';

    var query = ` query notifications {
        notifications(memberNumber:"123",limitNew: 25, limitHistory:50) {
            notificationsNew{
                notifications{
                    id
                    memberNumber
                    detail{
                        id
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
                        id
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

            var counterModel = new NotificationCount(result.data.notifications.newNotificationCount);
            //var counterModel = new NotificationCount(result.data.notifications.length);
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
            console.log(error);
        });

    /*
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
        */
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

