function NotificationsHeaderController(element, templateName, model) {
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._model = model ||  {} ;
    this._render();
}

NotificationsHeaderController.prototype._render = function() {
    this._element.html(this._template(this._model));
}