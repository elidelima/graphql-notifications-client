function NotificationsController(element, templateName, model, type, itemsLimit) {
    this._itemsLimit = itemsLimit;
    this._type = type;
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._model = model;
    this._orderOptions();
    this._render(0);
    this._paginationController = new PaginationStructureController(this);
}

NotificationsController.prototype._orderOptions = function() {
    var notifications = this._model.notifications;
    this._model.options = [];
    for (var i=0; i<notifications.length; i+=this._itemsLimit) {
        this._model.options.push(notifications.slice(i, i+this._itemsLimit));
    }
}

NotificationsController.prototype._render = function(page) {
    var content = this._model.options.length ? this._model.options[page] : [];
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
    //Enable/Disable archive icon
    $('input[name="options"]').each(function() {
        this.onclick = function(event){
            if($('input[name="options"]:checked').length){
                $('#mainArchiveIcon').toggleClass('icon__archive--disabled', false);
            } else {
                $('#mainArchiveIcon').toggleClass('icon__archive--disabled', true);
            }
        };
    });
    
    //Archive multiple notifications
    $('#mainArchiveIcon').click(function() {
        console.log("should do something")
        var notificationsId = [];
        $('input[name="options"]:checked').each(function(){
            notificationsId.push($(this).attr('id'));
        });
        console.log(notificationsId);
    });

    //archive single notification
    $('.archive-option .icon').each(function(){
        var element = this;
        this.onclick = function(event){
            var id = $(element).attr('id');
            alert("mutate notification id: " + id + ". Move to history.");
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

