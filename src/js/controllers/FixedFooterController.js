function FixedFooterController(element, templateName, model){
    this._element=element;
    this._model= model;
    this._template=Handlebars.partials[templateName];
    this._render();
    this._selectionCountController = new NotificationsSelectionCountController();
}

FixedFooterController.prototype._render = function() {
    console.log(this._template)
    console.log(this._model)
    this._element.html(this._template(this._model));
}


FixedFooterController.prototype.count = function() {
    this._model.count();
    this._render();
    this._selectionCountController.countChecked();
}




