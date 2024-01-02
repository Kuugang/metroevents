import { io } from 'socket.io-client';

// "undefined" means the URL will be computed from the `window.location` object
const URL = process.env.REACT_APP_NODE_ENV === 'production' ? "https://metroevents.vercel.app" : 'http://localhost:6969';

export const socket = io(URL);