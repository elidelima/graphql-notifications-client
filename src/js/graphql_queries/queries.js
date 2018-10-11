var GraphQLQueries={};


GraphQLQueries.queryNotifications=function(){
//########################### Notifications Query ############################//
var query = MultiString(function(){/**
         query{
            notifications{
              newNotificationCount
              hasMoreNewNotification
              notificationsNew{
                notifications{
                  id
                  situation
                  memberNumber
                  detail{
                    code
                    action
                    description
                  }
                }
              }
              notificationsHistory{
                  notifications{
                    situation
                    memberNumber
                  detail{
                    code
                    action
                    description
                  }
                }
              }
            }
            } 
            **/});    

    return query
}

GraphQLQueries.moveToHistory=function(memberNumber, notificationIds){
//########################### Notifications Query ############################//
var query = 'mutation{ '
+  'moveNotificationToHistory( '
+    'memberNumber:"'+memberNumber+'", '
+    'notificationIds:'+notificationIds+' '
+  ' ){ '
+    'id '
+    'situation '
+    'detail{ '
+      'description '
+      'action '
+      'priority '
+    '} '
+  '} '  
+'} '    

    return query

}

GraphQLQueries.subscribeNewNotification=function(memberNumber){
//####################### New notification Subscription #####################//

return{
  query: 'subscription { '
  +  'newNotification(memberNumber: "'+memberNumber+ '") { '
  +   ' mutation '
  +    'node { '
  +      'situation '
  +      'memberNumber '
  +      'createdOn '
  +      'detail { '
  +        'code '
  +        'description '
  +      '} '
  +    '} '
  +  '} '
  +'} ',
  variables:{
    
  }
}


}


GraphQLQueries.subscribeHistoryNotifications=function(memberNumber){
//####################### New notification Subscription #####################//
return {
    query:'subscription{ '
    +  'historyNotifications(memberNumber:"'+memberNumber+'"){ '
    +   ' mutation '    
    +    'node{ '
    +      'situation '
    +      'memberNumber '
    +      'detail{ '
    +        'code '
    +        'description '
    +        'action '
    +      '} '
    +    '} '
    +  '} '
    +'} ',
    variables:{}
};



}


