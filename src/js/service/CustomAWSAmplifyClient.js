var Amplify = window["aws-amplify"].default;
var API = window["aws-amplify"].API;
var graphqlOperation = window["aws-amplify"].graphqlOperation;

function CustomAWSAmplifyClient() {
    const appSyncConfig = {
        'aws_appsync_graphqlEndpoint': 'https://a3r22tv5sbe33msog2hkbne474.appsync-api.us-east-1.amazonaws.com/graphql',
        'aws_appsync_region': 'us-east-1',
        'aws_appsync_authenticationType': 'API_KEY',
        'aws_appsync_apiKey': 'da2-vye3ynjy2bag7edcrx4nijjfem'
    }
    this.client = Amplify.configure(appSyncConfig);
}

CustomAWSAmplifyClient.prototype.query = function(query) {
    query = graphqlOperation(query);
    return API.graphql(query);
}

CustomAWSAmplifyClient.prototype.subscribe = function (subscription) {
    subscription = graphqlOperation(subscription, {});
    return API.graphql(subscription);
}

CustomAWSAmplifyClient.prototype.mutate = function (mutation) {
    mutation = graphqlOperation(mutation, {});
    return API.graphql(mutation);
}