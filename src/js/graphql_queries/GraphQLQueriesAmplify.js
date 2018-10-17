var GraphQLQueriesAmplify={};

//########################### QUERIES ############################//
GraphQLQueriesAmplify.QUERIES = {
  NOTIFICATIONS : MultiString(function(){/**
    query Notifications ($memberNumber: String!, $limitNew: Int, $limitHistory: Int) {
      notifications (memberNumber: $memberNumber, limitNew: $limitNew, limitHistory: $limitHistory) {
        newNotificationCount
        hasMoreNewNotification
        notificationsNew{
          nextToken
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
          nextToken
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
    **/})
}

//########################### MUTATIONS ############################//
GraphQLQueriesAmplify.MUTATIONS = {
  MOVE_TO_HISTORY : MultiString(function(){/**
  mutation MoveToHistory($memberNumber: String!, $notificationIds: [String!]!){ 
    moveToHistory(memberNumber: $memberNumber, notificationIds: $notificationIds){
      memberNumber
      notifications {
        id
        situation
        createdOn
        detail {
          code
          description
          action
          priority
        }
        readOn
        timeToLive
      } 
    }
  }
  **/}),
}

//####################### SUBSCRIPTIONS #####################//
GraphQLQueriesAmplify.SUBSCRIPTIONS = {
  NEW_NOTIFICATIONS : MultiString(function(){/**
  subscription NewNotification ($memberNumber: String!) {
    newNotification(memberNumber: $memberNumber ) {
      id
      situation
      memberNumber
      createdOn
      detail {
        code
        description
        action
      } 
    } 
  }
  **/}),

  HISTORY_NOTIFICATIONS : MultiString(function(){/**
  subscription HistoryNotifications ($memberNumber: String!) {
    historyNotifications(memberNumber: $memberNumber ) {
      notifications {
        id
        situation
        createdOn
        detail {
          code
          description
          action
        }
      } 
    } 
  }
  **/})
}