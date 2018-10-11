function NotificationsController(element, templateName, model) {
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._model = model;
    this._render();
}

NotificationsController.prototype._render = function() {
    this._element.html(this._template(this._model));
    this._bindActions();
}

NotificationsController.prototype._bindActions = function() {
}

