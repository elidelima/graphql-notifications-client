var GraphQLQueriesAmplify={};

//########################### Notifications Query ############################//
GraphQLQueriesAmplify.QUERIES = {
  NOTIFICATIONS : MultiString(function(){
    /**query Notifications ($memberNumber: String!, $limitNew: Int, $limitHistory: Int) {
      notifications (memberNumber: $memberNumber, limitNew: $limitNew, limitHistory: $limitHistory)) {
        newNotificationCount
        hasMoreNewNotification
        notificationsNew{
          notifications{
            id
            situation
            memberNumber
            createdOn
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
              createdOn
            detail{
              code
              action
              description
            }
          }
        }
      }
    } 
    **/
  })
}

GraphQLQueriesAmplify.moveToHistory=function(memberNumber, notificationIds){
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

GraphQLQueriesAmplify.subscribeNewNotification=function(memberNumber){
//####################### New notification Subscription #####################//

return{
  query: 'subscription { '
  +  'newNotification(memberNumber: "'+memberNumber+ '") { '
  +   ' mutation '
  +    'node { '
  +      'id '
  +      'situation '
  +      'memberNumber '
  +      'createdOn '
  +      'detail { '
  +        'code '
  +        'description '
  +        'action '
  +      '} '
  +    '} '
  +  '} '
  +'} ',
  variables:{
    
  }
}


}


GraphQLQueriesAmplify.subscribeHistoryNotifications=function(memberNumber){
//####################### New notification Subscription #####################//
return {
    query:'subscription{ '
    +  'historyNotifications(memberNumber:"'+memberNumber+'"){ '
    +   ' mutation '    
    +    'node{ '
    +      'id '
    +      'situation '
    +      'memberNumber '
    +      'createdOn '
    +      'createdOn '
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


