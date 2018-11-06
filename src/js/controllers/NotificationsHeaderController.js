function NotificationsHeaderController(element, templateName, model, notificationControllers) {
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._model = model ||  {} ;
    this._render();
    this._notificationsControllers = notificationControllers;
}

NotificationsHeaderController.prototype._render = function() {
    this._element.html(this._template(this._model));
    this._bindActions();
}

NotificationsHeaderController.prototype._bindActions = function() {

    var self = this;

    var delay = (function(){
        var timer = 0;
        return function(callback, ms){
            clearTimeout (timer);
            timer = setTimeout(callback, ms);
        };
    })();

    this._element.find('#filter').keyup(function(){
        var input = this;
        delay(function(){
            var filterText = $(input).val();
            self._notificationsControllers.forEach(function(notificationsController) {
                notificationsController.setFilter(filterText);
            })
        }, 500 );
    });
}