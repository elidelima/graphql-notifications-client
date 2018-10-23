function NotificationsCountController(element, templateName, model) {
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._model = model;
    this._render();
}

NotificationsCountController.prototype._render = function() {
    this._element.html(this._template(this._model));
    this._bindActions();
}

NotificationsCountController.prototype._bindActions = function() {
    $("#notifications-icon").on("click", this.openNotificationsCentrePage.bind(this));
}

NotificationsCountController.prototype.increase = function() {
    this._model.increase();
    this._render();
}

NotificationsCountController.prototype.decrease = function(quantity) {
    this._model.decrease(quantity);
    this._render();
}

NotificationsCountController.prototype.setModel = function(model) {
    this._model = model;
    this._render();
}

NotificationsCountController.prototype.openNotificationsCentrePage = function() {
    $("#container-notifications").toggle()
}