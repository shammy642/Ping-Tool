import { WebSocketServer, WebSocket } from 'ws';
import 'dotenv';

const WS_PORT = process.env.WS_PORT;

const wss = new WebSocketServer({ port: WS_PORT});

export const broadcastPingResults = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};