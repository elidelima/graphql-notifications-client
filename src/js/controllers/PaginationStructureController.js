function PaginationStructureController(listController) {
    this._template = Handlebars.partials['pagination-structure'];
    this._listController = listController;
    this._model = {
        optionsLabel : [],
        lastItem : null,
    }
    this._render();
}

PaginationStructureController.prototype._render = function() {
    if (this._listController._model.options.length > 1) {
        this._loadOptionsLabel();
        this._listController._element.find("#pagination").html(this._template(this._model));
        this._bindActions();
    }
}

PaginationStructureController.prototype._loadOptionsLabel = function() {
    this._model.optionsLabel = [];
    var lastItem = this._model.lastItem || 1;
    for (var i = 0; i < this._listController._model.options.length; i++) {
        this._model.optionsLabel.push(i+lastItem);
    }
}

PaginationStructureController.prototype._bindActions = function() {
    var self =  this;
    this._listController._element.find('#pagination').find('#0').toggleClass('pagination-number--selected');
    this._listController._element.find('.pagination-number').each(function(){
        var pageId = $(this).attr('id');
        this.onclick = function(event){
            self._listController._element.find('#pagination').find('.pagination-number--selected').toggleClass('pagination-number--selected');
            self._listController._element.find('#pagination').find('#'+pageId).toggleClass('pagination-number--selected');
            self._listController._render(pageId);
        }
    })
}




