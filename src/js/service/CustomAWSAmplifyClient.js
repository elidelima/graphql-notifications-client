var Amplify = window["aws-amplify"].default;
var API = window["aws-amplify"].API;
var graphqlOperation = window["aws-amplify"].graphqlOperation;

function CustomAWSAmplifyClient() {
    var appSyncConfig = {
        'aws_appsync_graphqlEndpoint': 'https://wdiggt7dxncnfhrn422kgqti4e.appsync-api.us-east-1.amazonaws.com/graphql',
        'aws_appsync_region': 'us-east-1',
        'aws_appsync_authenticationType': 'API_KEY',
        'aws_appsync_apiKey': 'da2-uhwza7q2gvapdlrv63xy5jdoru'
    }
    this.client = Amplify.configure(appSyncConfig);
}

CustomAWSAmplifyClient.prototype.query = function(query) {
    API.graphql(graphqlOperation(query))
        .then(function(response) { console.log(response) })
        .catch(function(error) {console.log(error)});

}



