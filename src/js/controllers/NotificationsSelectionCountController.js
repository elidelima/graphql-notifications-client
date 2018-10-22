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

NotificationsSelectionCountController.prototype.toggleNotificationBackground = function(){
    var allIds=[];
    $('input[name="options"]').each(function(){
        var el=document.getElementById($(this).attr('id'));
        if(el.checked){
            allIds.push(true)
        }else{
            allIds.push(false)
        }
    });
    console.log(allIds);
    var i=0;
    for(i < 0;i<allIds.length;i++){
        if(allIds[i]){
            var el = $(".notification").get(i);
            $(el).addClass("bg__toggle");
        }else{
            var el = $(".notification").get(i);
            $(el).removeClass("bg__toggle");
        }
    }
    
}

NotificationsSelectionCountController.prototype.countChecked = function(){
    this.toggleNotificationBackground();
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