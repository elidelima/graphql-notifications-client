function NotificationsCountController(element, templateName, model) {
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._model = model;
    this._render();
}

NotificationsCountController.prototype._render = function() {
    this._element.html(this._template(this._model));
}

NotificationsCountController.prototype.increase = function() {
    this._model.increase();
    this._render();
}

NotificationsCountController.prototype.decrease = function() {
    this._model.decrease();
    this._render();
}

NotificationsCountController.prototype.setModel = function(model) {
    this._model = model;
    this._render();
}