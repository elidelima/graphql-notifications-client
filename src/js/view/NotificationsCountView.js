function NotificationsCountView(element, templateName) {
    this.element = element;
    this.template = Handlebars.partials[templateName];
}

NotificationsCountView.prototype.render = function(model){
    this._element.innerHTML = this._template(model);
}

