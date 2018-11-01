function PaginationStructureController(listController) {
    this._gqlClient = GraphQLClient.getGraphQLClient();
    this._template = Handlebars.partials['pagination-structure'];
    this._listController = listController;
    this._model = {
        optionsLabel : [],
        lastItem : null,
        hasNextPage : null,
        hasPreviousPage : null,
        activePage : 0,
        range : 0
    }
    this.render();
}

PaginationStructureController.prototype.getActivePage = function() {
    return this._model.activePage;
}

PaginationStructureController.prototype.setActivePage = function(activePage) {
    this._model.activePage = activePage;
}

PaginationStructureController.prototype.getRange = function() {
    return this._model.range;
}

PaginationStructureController.prototype.render = function() {

    this._model.hasNextPage = this._listController._model.hasMorePages ? true : false;
    this._model.hasPreviousPage = this._model.range > 0 ? true : false;

    if (this._listController._model.options.length > 1 || this._model.hasPreviousPage) {
        this._loadOptionsLabel();
        var optionsSize = this._model.optionsLabel.length-1;
        this.setActivePage(this.getActivePage() > optionsSize ? optionsSize : this.getActivePage());

        var content = this._template(this._model);
        this._listController._element.find("#pagination").html(content);
        this._bindActions();
    } else {
        var content = "";
        this._listController._element.find("#pagination").html(content);
        this.setActivePage(0);
    }
}

PaginationStructureController.prototype._loadOptionsLabel = function() {
    this._model.optionsLabel = [];
    var firstItem = (this._model.range * PaginationStructureHelper.PAGES_LIMIT)+1;
    for (var i = 0; i < this._listController._model.options.length; i++) {
        this._model.optionsLabel.push(i+firstItem);
    }
}

PaginationStructureController.prototype._bindActions = function() {
    var self = this;
    this._listController._element.find('#pagination').find('#'+self.getActivePage()).toggleClass('pagination-number--selected');
    this._listController._element.find('.pagination-number').each(function(){
        this.onclick = function(event){
            self.setActivePage($(this).attr('id'));
            self._listController.uncheckAllNotifications();
            self._listController._element.find('#pagination').find('.pagination-number--selected').toggleClass('pagination-number--selected');
            self._listController._element.find('#pagination').find('#'+self.getActivePage()).toggleClass('pagination-number--selected');
            self._listController.render();
            $('html').scrollTop(self._listController._element[0].offsetTop);
        }
    })

    this._listController._element.find('.icon-right').not('.pagination-icon--disabled').off('click').on('click', function(){
        self._model.range++;
        self._listController.navigateRange(0);
    });

    this._listController._element.find('.icon-left').not('.pagination-icon--disabled').off('click').on('click', function(){
        self._model.range--;
        self._listController.navigateRange(0);
    });
}
