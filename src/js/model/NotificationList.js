function NotificationsList(notifications, nextToken) {
    this._notifications = notifications;
    this._nextToken = nextToken;
    this._previousToken = null;
}

NotificationsList.prototype.getNotifications = function(notification) {
    return [].concat(this._notifications);
}

NotificationsList.prototype.remove = function(notification) {
    //TODO implement
}

NotificationsList.prototype.add = function(notification) {
    this._notifications.push(notification);
}

NotificationsList.prototype.clear = function() {
    this._notifications = [];    
}

NotificationsList.prototype.total = function() {
    this._notifications = [];
}


