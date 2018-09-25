const Amplify = window["aws-amplify"].default;
const { API, graphqlOperation } = window["aws-amplify"];

let appSyncConfig = {
    'aws_appsync_graphqlEndpoint': 'https://wdiggt7dxncnfhrn422kgqti4e.appsync-api.us-east-1.amazonaws.com/graphql',
    'aws_appsync_region': 'us-east-1',
    'aws_appsync_authenticationType': 'API_KEY',
    'aws_appsync_apiKey': 'da2-uhwza7q2gvapdlrv63xy5jdoru'
}

Amplify.configure(appSyncConfig);

const query = `
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

API.graphql(graphqlOperation(query))
    .then(response => { console.log(response) })
    .catch(error => console.log(error));