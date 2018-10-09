function NotificationsCountController(element, templateName, model) {
    this._element = element;
    this._template = Handlebars.partials[templateName];
    this._model = model;
    this._data = {
        model : model,
        controller : this
    }
    this._render();
}

NotificationsCountController.prototype._render = function() {
    //this._element.html(this._template(this._model));
    this._element.html(this._template(this._data));
}

NotificationsCountController.prototype.increase = function() {
    this._data.model.increase();
    this._render();
}

NotificationsCountController.prototype.setModel = function(model) {
    this._data.model = model;
    this._render();
}

NotificationsCountController.prototype.openNotificationsCentrePage = function() {
    alert("should open page");
}



