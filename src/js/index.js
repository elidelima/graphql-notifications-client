var AmplifyIndex = window["aws-amplify"].default;
var APIIndex = window["aws-amplify"].API;
var graphqlOperationIndex = window["aws-amplify"].graphqlOperation;

var appSyncConfig = {
    // 'aws_appsync_graphqlEndpoint': 'https://wdiggt7dxncnfhrn422kgqti4e.appsync-api.us-east-1.amazonaws.com/graphql',
     'aws_appsync_graphqlEndpoint': 'https://2lwcq7rahnhpvaxlyj5i2m7zj4.appsync-api.us-east-1.amazonaws.com/graphql',
    'aws_appsync_region': 'us-east-1',
    'aws_appsync_authenticationType': 'API_KEY',
    'aws_appsync_apiKey': 'da2-k536rjwvejhnrg47ijdkz5lcwy'
}

AmplifyIndex.configure(appSyncConfig);

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
/*
APIIndex.graphql(graphqlOperationIndex(query))
    .then(function(response) { console.log(response) })
    .catch(function(error) {console.log(error)});
    */