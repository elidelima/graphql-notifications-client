function NotificationFooter(count) {
    this.selectionCount=count;
}

NotificationFooter.prototype.count = function(){
    
var notificationsId = [];
    $('input[name="options"]:checked').each(function(){
    notificationsId.push($(this).attr('id'));
    });
    
    this.selectionCount=notificationsId.length;
}
