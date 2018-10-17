function FixedFooterController(element, templateName, model, listController){
    this._listController = listController;
    this._element=element;
    this._model= model;
    this._template=Handlebars.partials[templateName];
    this._render();
    this.selectionCountController = new NotificationsSelectionCountController();
    this._listController = listController;
}

FixedFooterController.prototype._render = function() {
    this._element.html(this._template(this._model));
    this._bindActions();
}

FixedFooterController.prototype.count = function() {
    this._model.count();
    this._render();
    this.selectionCountController.countChecked();
}

FixedFooterController.prototype._bindActions = function() {
    var self = this;
    $('#mainArchiveIconMobile').off('click').on('click', function() {
        self._listController._moveToHistory(self._listController.getSelectedNotificationsId());
    });

    //uncheck all notifications mobile
    $('#uncheckAllMobile').off('click').on('click',function(){
        self._listController.uncheckAllNotifications();
        self.selectionCountController.hide();
    });   
}


