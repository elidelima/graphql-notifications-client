function NotificationCount(count) {
    this.count = count;
}

NotificationCount.prototype.increase = function(quantity){
    this.count += quantity || 1 ;
}

NotificationCount.prototype.decrease = function(quantity){
    this.count -= quantity || 1 ;
}