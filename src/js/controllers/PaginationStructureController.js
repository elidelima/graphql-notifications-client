function PaginationStructureController(listController) {
    this._template = Handlebars.partials['pagination-structure'];
    this._listController = listController;
    this._model = {
        optionsLabel : [],
        lastItem : null,
    }
    this._activePage = 0;
    this.render();
}

PaginationStructureController.prototype.getActivePage = function() {
    return this._activePage;
}

PaginationStructureController.prototype.render = function() {
    var content;
    if (this._listController._model.options.length > 1) {
        this._loadOptionsLabel();
        content = this._template(this._model);
        this._bindActions();
    } else {
        content = "";
        this._activePage = 0;
    }
    this._listController._element.find("#pagination").html(content);
}

PaginationStructureController.prototype._loadOptionsLabel = function() {
    this._model.optionsLabel = [];
    var lastItem = this._model.lastItem || 1;
    for (var i = 0; i < this._listController._model.options.length; i++) {
        this._model.optionsLabel.push(i+lastItem);
    }
    var optionsSize = this._model.optionsLabel.length-1;
    this._activePage = this._activePage > optionsSize ? optionsSize : this._activePage;
}

PaginationStructureController.prototype._bindActions = function() {
    var self = this;
    this._listController._element.find('#pagination').find('#'+self._activePage).toggleClass('pagination-number--selected');
    this._listController._element.find('.pagination-number').each(function(){
        this.onclick = function(event){
            self._activePage = $(this).attr('id');
            self._listController.uncheckAllNotifications();
            self._listController._element.find('#pagination').find('.pagination-number--selected').toggleClass('pagination-number--selected');
            self._listController._element.find('#pagination').find('#'+self._activePage).toggleClass('pagination-number--selected');
            self._listController.render();
        }
    })
}



