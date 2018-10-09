var ApolloClient = apolloClient.default;
var createNetworkInterface = apolloClient.createNetworkInterface;
var SubscriptionClient = SubscriptionsTransportWs.SubscriptionClient;
var addGraphQLSubscriptions = SubscriptionsTransportWs.addGraphQLSubscriptions;
var gql = graphqlTag.default;

function CustomApolloClient() {
    var networkInterface = createNetworkInterface({
        uri: "http://localhost:4000/graphql",
    });

    // Create WebSocket client
    var wsClient = new SubscriptionClient('ws://localhost:4000/subscriptions', {
        reconnect: true,
        connectionParams: {
            // Pass any arguments you want for initialization
        }
    });

    // Extend the network interface with the WebSocket
    var networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
        networkInterface,
        wsClient
    );

    this._client = new ApolloClient({
        networkInterface: networkInterfaceWithSubscriptions
    });
}

CustomApolloClient.prototype.query = function (query) {
    query = gql`${query}`;
    return this._client.query({ query });
}

CustomApolloClient.prototype.subscribe = function (subscription) {
    return this._client.subscribe({
        query: gql`subscription {
            newNotification (memberNumber: "1234") {
                mutation
                node {
                    id
                    status
                    details {
                        code
                        description
                    }
                }
            }
        }`,
        variables: {}
    })
}