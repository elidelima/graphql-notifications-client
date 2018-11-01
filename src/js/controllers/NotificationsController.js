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
        console.log(this._model);
        if (this._paginationController.getRange() > 0 ||this._model.hasMorePages) {

            //TODO test case where last no items left on a page

            self.navigateRange(self._paginationController.getActivePage());
        } else {
            //this._model.notifications.sort(notificationComparator);
            this._orderOptions();
            this._paginationController.render();
            this.render();
        }
    }
}

NotificationsController.prototype.addNotifications = function(notifications) {
    if (this._paginationController.getRange() > 0) return;

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

NotificationsController.prototype.navigateRange = function(initialPage) {
    console.log("navigate page to: " + initialPage);
    var self = this;
    var offSet = self._paginationController.getRange() * this._sizeLimit;
    self.queryNotifications(offSet, function(notificationsQueryResponse) {
        console.log(notificationsQueryResponse);
        self._model.notifications = notificationsQueryResponse.notifications;
        self._model.hasMorePages = notificationsQueryResponse.hasMorePages;
        
        self._orderOptions();
        self._paginationController.setActivePage(initialPage);
        self._paginationController.render();
        self.render();
    });
}


NotificationsController.prototype.queryNotifications = function(offset, callback) {
    var self = this;
    var variables = { memberNumber: MEMBER_NUMBER };
    variables['limit' + self.type] = self._sizeLimit;
    variables['offset' + self.type] = offset;
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

/*
NotificationsController.prototype.resetNotifications = function(navigationControl) {
    var self = this;
    self.queryNotifications(self._model.nextToken, function(notificationsQueryResponse) {
        self._model.notifications = notificationsQueryResponse.notifications;
        self._model.nextToken = notificationsQueryResponse.nextToken;
        self._model.previousToken = notificationsQueryResponse.previousToken;
        self._model.rangeIndex = notificationsQueryResponse.rangeIndex;

        navigationControl.range--;
        if (navigationControl.range > 0 && self._model.nextToken) {
            self.resetNotifications(navigationControl);
        } else {
            self._orderOptions();
            self._paginationController.render();
            self.render();
        }
    });
}
*/

function notificationComparator(a, b) {
    if (a.createdOn < b.createdOn)
        return -1;
    if (a.createdOn > b.createdOn)
        return 1;
    //a == b
    return 0;
}