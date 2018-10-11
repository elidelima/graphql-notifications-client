var Amplify = window["aws-amplify"].default;
var API = window["aws-amplify"].API;
var graphqlOperation = window["aws-amplify"].graphqlOperation;

function CustomAWSAmplifyClient() {
    var appSyncConfig = {
        'aws_appsync_graphqlEndpoint': 'https://2lwcq7rahnhpvaxlyj5i2m7zj4.appsync-api.us-east-1.amazonaws.com/graphql',
        'aws_appsync_region': 'us-east-1',
        'aws_appsync_authenticationType': 'API_KEY',
        'aws_appsync_apiKey': 'da2-k536rjwvejhnrg47ijdkz5lcwy'
    }
    this.client = Amplify.configure(appSyncConfig);
}

CustomAWSAmplifyClient.prototype.query = function(query) {
    query = graphqlOperation(query);
    return API.graphql(query);
}




