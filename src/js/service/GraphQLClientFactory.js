var GraphQLClient = {
    instance : null
};

GraphQLClient.getGraphQLClient = function() {
    if (!GraphQLClient.instance) 
        GraphQLClient.instance = GraphQLClientFactory.createGraphQLClient(GrapQLClientType.APOLLO);
    return GraphQLClient.instance;
}

var GrapQLClientType = Object.freeze({
    "AMPLIFY":   "AMPLIFY",
    "APOLLO": "APOLLO",
});

var GraphQLClientFactory = {};
GraphQLClientFactory.createGraphQLClient = function(type) {

    var grapqlClient;

    switch (type) {
        case  GrapQLClientType.AMPLIFY: 
            grapqlClient = new CustomAWSAmplifyClient();
            break;
        
        case  GrapQLClientType.APOLLO: 
            grapqlClient = new CustomApolloClient();    
            break;
    
    }

    return grapqlClient;
}
