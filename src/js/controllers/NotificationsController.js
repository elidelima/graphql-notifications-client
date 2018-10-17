function NotificationsController(element, templateName, model, type, itemsLimit) {
    this._gqlClient = GraphQLClient.getGraphQLClient();
    this._itemsLimit = itemsLimit;
    this._type = type;
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._model = model;
    this._activePage = 0;
    this._orderOptions();
    this._paginationController = new PaginationStructureController(this);
    this._selectionCountController = new NotificationsSelectionCountController();
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
    if (this._type == "NEW") {
        this._bindArchiveActions();

    } else if (this._type == "HISTORY") {
        this._bindHistoryActions();
    }
}

NotificationsController.prototype._bindArchiveActions = function() {
    var self = this;
    
    //Enable/Disable archive icon
    $('input[name="options"]').each(function() {
        this.onclick = function(event){     
            self.fixedFooter.count();   
            //Archive multiple notifications mobile
            $('#mainArchiveIconMobile').off('click').on('click', function() {
                var notificationsId = [];
                $('input[name="options"]:checked').each(function(){
                    notificationsId.push($(this).attr('id'));
                });
                self._moveToHistory(notificationsId);

                for(var i=0; i<notificationsId.length; i++){
                    var el = document.getElementById(notificationsId[i]);
                    el.checked = false;
                }
                self.fixedFooter.count();  
            });

            //uncheck all notifications mobile
            $('#uncheckAllMobile').off('click').on('click',function(){
                var notificationsId = [];
                $('input[name="options"]:checked').each(function(){
                    notificationsId.push($(this).attr('id'));
                });
                for(var i=0; i<notificationsId.length; i++){
                    var el = document.getElementById(notificationsId[i]);
                    el.checked = false;
                }
                self.fixedFooter.count();  
            });               


            if($('input[name="options"]:checked').length){
                self.toggleMainArchiveIcon(false);
            } else {
                self.toggleMainArchiveIcon(true);
            }
        };
    });
    
    //Archive multiple notifications
    $('#mainArchiveIcon').off('click').on('click', function() {
        var notificationsId = [];
        $('input[name="options"]:checked').each(function(){
            notificationsId.push($(this).attr('id'));
        });
        self._moveToHistory(notificationsId);
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

NotificationsController.prototype._bindHistoryActions = function() {
    var self = this;
    $("#toggleListIcon").click(function(){
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
    
    $('input[name="options"]').each(function(){
        console.log($(this).is(':checked'));
        console.log($(this).attr('id'));
        $(this).attr('checked', false);
    });
    this.toggleMainArchiveIcon(true);
}

/**
 * 
 * @param {*} ids - List of notification IDs
 */
NotificationsController.prototype._moveToHistory = function(ids) {
    if (!ids || !ids.length) return;
    var mutation = GraphQLQueries.moveToHistory(window.MEMBER_NUMBER,JSON.stringify(ids));
    //console.log(mutation)
    this._gqlClient.mutate(mutation)
        .then(function(result) {
            console.log("Moved to Notifications Successfully")
            //console.log(result)
        })
        .catch(function(error) {
            console.log("error loading counter for notifications")
            console.log(error)
        });
}

NotificationsController.prototype.removeNotifications = function(notifications) {
    var self = this;
    notifications.forEach(function(notification) {
        var notificationIndex = self._model.notifications.findIndex(function(controllerNotification) {
            return controllerNotification.id == notification.id;
        });
        self._model.notifications.splice(notificationIndex, 1);
    })
    //this._model.notifications.sort(notificationComparator);
    this._orderOptions();
    this._paginationController.render();
    this.render();
}

NotificationsController.prototype.addNotifications = function(notifications) {
    this._model.notifications = this._model.notifications.concat(notifications);
    this._model.notifications.sort(notificationComparator);
    this._orderOptions();
    this._paginationController.render();
    this.render();
}

NotificationsController.prototype._loadFixedFooter = function() {
    console.log("_load fixed footer")
    var fixedFooterModel = new NotificationFooter();
    this.fixedFooter = new FixedFooterController(
        $("#notificationFooterFixed"), 
        'notifications-footer-fixed',
        fixedFooterModel
    )
}


function notificationComparator(a, b) {
    if (a.createdOn < b.createdOn)
        return -1;
    if (a.createdOn > b.createdOn)
        return 1;
    //a == b
    return 0;
}