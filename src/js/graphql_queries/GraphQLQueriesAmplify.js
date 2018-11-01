var GraphQLQueriesAmplify={};

//########################### QUERIES ############################//
GraphQLQueriesAmplify.QUERIES = {
  NOTIFICATIONS : MultiString(function(){/**
    query Notifications ($memberNumber: String!, $filter: String, $limitNew: Int, $offsetNew: Int, $limitHistory: Int, $offsetHistory: Int) {
      notifications (memberNumber: $memberNumber, filter: $filter, limitNew: $limitNew, offsetNew: $offsetNew, limitHistory: $limitHistory, offsetHistory: $offsetHistory) {
        notificationsNew{
          hasMorePages
          notifications{
            id
            memberNumber
            description
            callToAction
            createdOn
            situation
            appLink
            mobileLink
            priority
            readOn
            lastUpdatedDate
          }
        }
        notificationsHistory{
          hasMorePages
          notifications{
            id
            memberNumber
            description
            callToAction
            createdOn
            situation
            appLink
            mobileLink
            priority
            readOn
            lastUpdatedDate
          }
        }
      }
    } 
    **/}),

    NOTIFICATIONS_NEW_COUNT : MultiString(function(){/**
      query GetNotificationNewCount ($memberNumber: String!) {
        getNotificationNewCount (memberNumber: $memberNumber) {
          count
        }
      } 
      **/})
}

//########################### MUTATIONS ############################//
GraphQLQueriesAmplify.MUTATIONS = {
  MOVE_TO_HISTORY : MultiString(function(){/**
  mutation MoveToHistory($memberNumber: String!, $notificationIds: [String!]!){ 
    moveToHistory(memberNumber: $memberNumber, notificationIds: $notificationIds){
      type
      memberNumber
      notifications {
          id
          memberNumber
          description
          callToAction
          createdOn
          situation
          appLink
          mobileLink
          priority
          readOn
          lastUpdatedDate
        }
    }
  }
  **/}),
}

//####################### SUBSCRIPTIONS #####################//
GraphQLQueriesAmplify.SUBSCRIPTIONS = {
  
  NOTIFICATION_CHANGE : MultiString(function(){/**
    subscription NotificationChange($memberNumber: String!) {
      notificationChange(memberNumber: $memberNumber ) {
        type
        notifications {
          id
          memberNumber
          description
          callToAction
          createdOn
          situation
          appLink
          mobileLink
          priority
          readOn
          lastUpdatedDate
        }
      } 
    }
  **/}),

  //@deprecated
  NEW_NOTIFICATIONS : MultiString(function(){/**
  subscription NewNotification ($memberNumber: String!) {
    newNotification(memberNumber: $memberNumber ) {
      id
      memberNumber
      description
      callToAction
      createdOn
      situation
      appLink
      mobileLink
      priority
      readOn
      lastUpdatedDate
    } 
  }
  **/}),

  //@deprecated
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
          priority
        }
      } 
    } 
  }
  **/})
}