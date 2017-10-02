import ApolloClient,{createNetworkInterface} from 'apollo-client';
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
