var AmplifyIndex = window["aws-amplify"].default;
var APIIndex = window["aws-amplify"].API;
var graphqlOperationIndex = window["aws-amplify"].graphqlOperation;

var appSyncConfig = {
    'aws_appsync_graphqlEndpoint': 'https://2lwcq7rahnhpvaxlyj5i2m7zj4.appsync-api.us-east-1.amazonaws.com/graphql',
    'aws_appsync_region': 'us-east-1',
    'aws_appsync_authenticationType': 'API_KEY',
    'aws_appsync_apiKey': 'da2-k536rjwvejhnrg47ijdkz5lcwy'
}

AmplifyIndex.configure(appSyncConfig);
/*
var query = ' query GetPost { '
    +'queryNotificationByMemberAndStatus(memberNumber: "123456789",notificationStatus:"NEW",count:1) {'
    +'        notifications {'
    +'            code'
    +'            memberNumber'
    +'            notificationDetail{'
    +'                code'
    +'            }  '
    +'        } '
    +'    } '
    +'}'
*/

var query = ` query notifications {
    notifications(memberNumber:"123",limitNew: 5,limitHistory:10) {
        notificationsNew{
            notifications{
                id
                memberNumber
                detail{
                    id
                    description
                    action
                }
            }
            nextToken
        }
        notificationsHistory{
            notifications{
                id
                memberNumber
                detail{
                    id
                    description
                    action
                }
            }
            nextToken
        }
        newNotificationCount
        hasMoreNewNotification
    }
}`

/*
var query = `
query GetPost {
    queryNotificationByMemberAndStatus(memberNumber: "123456789",notificationStatus:"NEW",count:1) {
        notifications {
            code
            memberNumber
            notificationDetail{
                code
            }
        }
    }
}
`;
*/

// query = graphqlOperationIndex(query);
// console.log(query);
// APIIndex.graphql(query)
//     .then(function(response) { console.log(response) })
//     .catch(function(error) {console.log(error)});

/*
const SubscribeToEventComments = `subscription historyNotifications($eventId: String!) {
    subscribeToEventComments(eventId: $eventId) {
        eventId
        commentId
        content
    }
}`;
*/
  
const subscribeToHistoryNotifications = `subscription HistoryNotifications {
    historyNotifications (memberNumber: "123456789") {
        id
        memberNumber
        detail {
            id
            description
            action
        }
    }
}`;


// Subscribe with eventId 123
// const subscription = APIIndex.graphql(
//     graphqlOperationIndex(subscribeToHistoryNotifications, { memberNumber: '123' })
// ).subscribe({
//     next: (eventData) => console.log(eventData)
// });