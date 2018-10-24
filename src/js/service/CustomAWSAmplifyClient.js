var Amplify = window["aws-amplify"].default;
var API = window["aws-amplify"].API;
var graphqlOperation = window["aws-amplify"].graphqlOperation;

function CustomAWSAmplifyClient() {
    var appSyncConfig = {
        'aws_appsync_graphqlEndpoint': 'https://zxjuxwn3zfaohajupo366f4xai.appsync-api.us-east-1.amazonaws.com/graphql',
        'aws_appsync_region': 'us-east-1',
        'aws_appsync_authenticationType': 'API_KEY',
        'aws_appsync_apiKey': 'da2-wnpcgly5rnfjtnybtily465lmi'
    }
    this.client = Amplify.configure(appSyncConfig);
}

CustomAWSAmplifyClient.prototype.query = function(query, variables) {
    query = graphqlOperation(query, variables);
    return API.graphql(query);
}

CustomAWSAmplifyClient.prototype.subscribe = function (subscriptionQuery, variables) {
    subscription = graphqlOperation(subscriptionQuery, variables);
    return API.graphql(subscription);
}

CustomAWSAmplifyClient.prototype.mutate = function (mutationQuery, variables) {
    mutation = graphqlOperation(mutationQuery, variables);
    return API.graphql(mutation);
}