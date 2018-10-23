function PaginationStructureController(listController) {
    this._gqlClient = GraphQLClient.getGraphQLClient();
    this._template = Handlebars.partials['pagination-structure'];
    this._listController = listController;
    this._model = {
        optionsLabel : [],
        lastItem : null,
        hasNext : null,
        hasPrevious : null  
    }
    this._activePage = 0;
    this.render();
}

PaginationStructureController.prototype.getActivePage = function() {
    return this._activePage;
}

PaginationStructureController.prototype.setActivePage = function(activePage) {
    this._activePage = activePage;
}

PaginationStructureController.prototype.render = function() {
    var content;
    if (this._listController._model.options.length > 1 ||
        this._listController._model.nextToken ||
        this._listController._model.previousToken) {

        this._loadOptionsLabel();
        content = this._template(this._model);
        this._listController._element.find("#pagination").html(content);
        this._bindActions();
    } else {
        content = "";
        this._listController._element.find("#pagination").html(content);
        this._activePage = 0;
    }
}

PaginationStructureController.prototype._loadOptionsLabel = function() {
    this._model.optionsLabel = [];

    var firstItem = ((this._listController._model.rangeIndex-1) * this._listController._itemsLimit)+1;
    for (var i = 0; i < this._listController._model.options.length; i++) {
        this._model.optionsLabel.push(i+firstItem);
    }

    this._model.hasNext = this._listController._model.nextToken ? true : false;
    this._model.hasPrevious = this._listController._model.previousToken ? true : false;
    
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

    this._listController._element.find('.icon-right').not('.pagination-icon--disabled').off('click').on('click', function(){
        self._listController.moveToNextRange();
    });

    this._listController._element.find('.icon-left').not('.pagination-icon--disabled').off('click').on('click', function(){
        self._listController.moveToPreviousRange();
    });
}

PaginationStructureController.prototype.moveNext = function() {
    var self = this;
    var variables = { memberNumber: MEMBER_NUMBER };
    if (this._listController.type == "New") {
        variables.limitNew = PaginationStructureHelper.SIZE_LIMIT_LIST_NEW;
        variables.nextTokenNew = self._listController._model.nextToken;
    } else {
        variables.limitHistory = PaginationStructureHelper.SIZE_LIMIT_LIST_NEW;
        variables.nextTokenHistory = self._listController._model.nextToken;
    }

    console.log(variables);
    self._gqlClient
        .query(GraphQLQueriesAmplify.QUERIES.NOTIFICATIONS, variables)
        .then(function(response){
            var notifications = self._listController.type == "New" 
                ? notifications = response.data.notifications.notificationsNew
                : notifications = response.data.notifications.notificationsHistory;
            console.log(notifications);

        })
        .catch(function(err){
            console.log('error')
            console.log(err);
        });
}



