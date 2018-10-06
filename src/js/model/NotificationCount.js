function NotificationCount(count) {
    this.count = count;
}

NotificationCount.prototype.increase = function(){
    this.count++;
}

NotificationCount.prototype.decrease = function(){
    this.count--;
}