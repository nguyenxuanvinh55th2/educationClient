import {createClass} from "asteroid";
import { socketEndpoint } from './config';
const Asteroid = createClass();
// Connect to a Meteor backend
export const asteroid = new Asteroid({
    endpoint: socketEndpoint + '/websocket'
});
