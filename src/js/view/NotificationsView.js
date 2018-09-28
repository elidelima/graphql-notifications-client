function NotificationsView(component, templateName) {
    this._element = component;
    this._template = Handlebars.partials[templateName]; 
}

NotificationsView.prototype.render(model) = function(model){
    this._element.innerHTML = this._template(model);
}

