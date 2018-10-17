function NotificationsSelectionCountController(){
    this.countChecked();
}

NotificationsSelectionCountController.prototype._show = function(){
    $('#notificationFooterFixed > div').removeClass('notifications-fixed__footer--non-visible')
    $('#notificationFooterFixed > div').addClass('notifications-fixed__footer')
}

NotificationsSelectionCountController.prototype.hide = function(){
    $('#notificationFooterFixed > div').removeClass('notifications-fixed__footer')
    $('#notificationFooterFixed > div').addClass('notifications-fixed__footer--non-visible')
}

NotificationsSelectionCountController.prototype.countChecked = function(){

    var notificationsId = [];
    $('input[name="options"]:checked').each(function(){
        notificationsId.push($(this).attr('id'));
    });

    if(notificationsId.length > 0 ){
        this._show();
    }else{
        this.hide();
    }

}