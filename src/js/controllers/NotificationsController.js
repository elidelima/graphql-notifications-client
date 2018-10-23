function NotificationsController(element, templateName, model, type, itemsLimit) {
    this.type = type;
    this._gqlClient = GraphQLClient.getGraphQLClient();
    this._itemsLimit = itemsLimit;
    this._sizeLimit = type == 'New' 
        ? PaginationStructureHelper.SIZE_LIMIT_LIST_NEW 
        : PaginationStructureHelper.SIZE_LIMIT_LIST_HISTORY;
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._model = model;
    this._activePage = 0;
    this._orderOptions();
    this._paginationController = new PaginationStructureController(this);
    this.fixedFooter = null;
    this._loadFixedFooter();
    this.render();
}

NotificationsController.prototype._orderOptions = function() {
    var notifications = this._model.notifications;
    this._model.options = [];
    for (var i=0; i<notifications.length; i+=this._itemsLimit) {
        this._model.options.push(notifications.slice(i, i+this._itemsLimit));
    }
}

NotificationsController.prototype.render = function() {
    var pageNumber = this._paginationController.getActivePage();
    var content = this._model.options.length ? this._model.options[pageNumber] : [];
    this._element.find("#list-content").html(this._template(content));
    this._bindActions();
}

NotificationsController.prototype._bindActions = function() {
    if (this.type == 'New') {
        this._bindArchiveActions();

    } else if (this.type == 'History') {
        this._bindHistoryActions();
    }
}

NotificationsController.prototype._bindArchiveActions = function() {
    var self = this;
    
    //Enable/Disable archive icon
    $('input[name="options"]').each(function() {
        this.onclick = function(event){     
            self.fixedFooter.count();   
            
            if($('input[name="options"]:checked').length){
                self.toggleMainArchiveIcon(false);
            } else {
                self.toggleMainArchiveIcon(true);
            }
        };
    });

    //Archive multiple notifications
    $('#mainArchiveIcon').off('click').on('click', function() {
        self._moveToHistory(self.getSelectedNotificationsId());
    }); 

    //archive single notification
    $('.archive-option .icon').each(function(){
        var element = this;
        this.onclick = function(event){
            var id = $(element).attr('id');
            console.log("mutate notification id: " + id + ". Move to history.");
            self._moveToHistory([id]);
            //alert("mutate notification id: " + id + ". Move to history.");
        }
    });
}

NotificationsController.prototype.getSelectedNotificationsId = function() {
    var notificationsId = [];
    $('input[name="options"]:checked').each(function(){
        notificationsId.push($(this).attr('id'));
    });
    return notificationsId;
}

NotificationsController.prototype._bindHistoryActions = function() {
    var self = this;
    $('#toggleListIcon').off('click').on('click', function() {
        $(this).toggleClass("icon-arrow-hide");
        $(this).toggleClass("icon-arrow-show");
        self._element.find("#list-content").toggle();
        self._element.find("#list-footer").toggle();
    });
}

NotificationsController.prototype.toggleMainArchiveIcon = function(action) {
    $('#mainArchiveIcon').toggleClass('icon__archive--disabled', action);
}

NotificationsController.prototype.uncheckAllNotifications = function() {
    $('input[name="options"]:checked').each(function(){
        var notificationId = $(this).attr('id');
        document.getElementById(notificationId).checked = false;
    });
    this.toggleMainArchiveIcon(true);
    this.fixedFooter.count();  
}

/**
 * 
 * @param {*} ids - List of notification IDs
 */
NotificationsController.prototype._moveToHistory = function(ids) {
    if (!ids || !ids.length) return;
    var self = this;
    
    //TODO remove after adpting apollo client
    //var mutation = GraphQLQueries.moveToHistory(window.MEMBER_NUMBER,JSON.stringify(ids));
    var mutation = GraphQLQueriesAmplify.MUTATIONS.MOVE_TO_HISTORY;
    var variables = { memberNumber: MEMBER_NUMBER, notificationIds: ids };
    this._gqlClient.mutate(mutation, variables)
        .then(function(result) {
            //console.log("Moved to Notifications Successfully")
            //console.log(result)
            self.toggleMainArchiveIcon(true);
            self.fixedFooter.selectionCountController.hide();
        })
        .catch(function(error) {
            console.log("error loading counter for notifications")
            console.log(error)
        });
}

NotificationsController.prototype.removeNotifications = function(notifications) {
    var self = this;
    var hasChanges = false;
    notifications.forEach(function(notification) {
        var notificationIndex = self._model.notifications.findIndex(function(controllerNotification) {
            return controllerNotification.id == notification.id;
        });
        
        if (notificationIndex != -1) {
            hasChanges = true;
            self._model.notifications.splice(notificationIndex, 1);
        }
    })
    if (hasChanges) {
        var self = this;

        if (this._model.nextToken ||
            (this._model.rangeIndex > 1 && (this._model.nextToken || this._model.previous))) {
            
            var navigationControl = {
                range : this._model.rangeIndex
            }
            //reset search from page 1
            this._model.nextToken = null;
            //nagivates to selected range
            self.resetNotifications(navigationControl);
            
        } else {
            //this._model.notifications.sort(notificationComparator);
            this._orderOptions();
            this._paginationController.render();
            this.render();
        }
    }
}

NotificationsController.prototype.addNotifications = function(notifications) {
    if (this._model.rangeIndex > 1) return;
    console.log(notifications)
    this._model.notifications = notifications.concat(this._model.notifications);
    if (this._model.notifications.length > this._sizeLimit)
        this._model.notifications.length = this._sizeLimit;
    //this._model.notifications = this._model.notifications.concat(notifications);
    //this._model.notifications.sort(notificationComparator);
    this._orderOptions();
    this._paginationController.render();
    this.render();
}

NotificationsController.prototype._loadFixedFooter = function() {
    var fixedFooterModel = new NotificationFooter();
    this.fixedFooter = new FixedFooterController(
        $("#notificationFooterFixed"), 
        'notifications-footer-fixed',
        fixedFooterModel,
        this
    )
}

NotificationsController.prototype.navigateRange = function(direction) {
    var self = this;
    var token;
    if (direction == "NEXT") {
        token = self._model.nextToken;

    } else if (direction == "PREVIOUS") {
        token = self._model.previousToken;
    }

    self.queryNotifications(token, function(notificationsQueryResponse) {
        self._model.notifications = notificationsQueryResponse.notifications;
        self._model.nextToken = notificationsQueryResponse.nextToken;
        self._model.previousToken = notificationsQueryResponse.previousToken;
        self._model.rangeIndex = notificationsQueryResponse.rangeIndex;
        
        self._orderOptions();
        self._paginationController.setActivePage(0);
        self._paginationController.render();
        self.render();
    });
}

NotificationsController.prototype.moveToNextRange = function() {
    this.navigateRange("NEXT");
}

NotificationsController.prototype.moveToPreviousRange = function() {
    this.navigateRange("PREVIOUS");
}

NotificationsController.prototype.queryNotifications = function(token, callback) {
    var self = this;
    var variables = { memberNumber: MEMBER_NUMBER };
    variables['limit' + self.type] = self._sizeLimit;
    variables['pageToken' + self.type] = token;
    self._gqlClient
        .query(GraphQLQueriesAmplify.QUERIES.NOTIFICATIONS, variables)
        .then(function(response){
            var notifications = response.data.notifications['notifications' + self.type]
            callback(notifications);
    })
    .catch(function(err){
        console.log('error')
        console.log(err);
    });
}

NotificationsController.prototype.resetNotifications = function(navigationControl) {
    console.log(navigationControl);
    var self = this;
    self.queryNotifications(self._model.nextToken, function(notificationsQueryResponse) {
        self._model.notifications = notificationsQueryResponse.notifications;
        self._model.nextToken = notificationsQueryResponse.nextToken;
        self._model.previousToken = notificationsQueryResponse.previousToken;
        self._model.rangeIndex = notificationsQueryResponse.rangeIndex;

        navigationControl.range--;
        if (navigationControl.range > 0 && self._model.nextToken) {
            console.log(self._model);
            self.resetNotifications(navigationControl);
        } else {
            self._orderOptions();
            self._paginationController.render();
            self.render();
        }
    });
}

function notificationComparator(a, b) {
    if (a.createdOn < b.createdOn)
        return -1;
    if (a.createdOn > b.createdOn)
        return 1;
    //a == b
    return 0;
}