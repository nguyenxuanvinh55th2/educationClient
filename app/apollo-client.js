import ApolloClient,{createNetworkInterface} from 'apollo-client';
// import { Client } from 'subscriptions-transport-ws';
//
// // import login from './login'
// import addGraphQLSubscriptions from './addGraphQL.js'
//
// //conect websocket on server
// const wsClient = new Client('ws://localhost:3000');
// //conect graphql
// const networkInterface = createNetworkInterface({ uri: 'http://localhost:3000/graphql' })
//
// const networkInterfaceWithSubscriptions = addGraphQLSubscriptions(
//   networkInterface,
//   wsClient,
// );
//
// export const client = new ApolloClient({
//   networkInterface: networkInterfaceWithSubscriptions,
// })

import { graphqlUrl } from './config';
let ApolloClientCase;
const networkInterface = createNetworkInterface({ uri: graphqlUrl });
if(caseProto === 'local'){
    //dev
    ApolloClientCase = new ApolloClient({
      networkInterface
    });
} else {
    //Replace with this when build
     ApolloClientCase = new ApolloClient();
}
export const client = ApolloClientCase;
