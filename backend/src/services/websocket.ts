import WebSocket from 'ws';
import { Server } from 'http';

// Store clients in a shared Map
const clients = new Map<string, WebSocket>();

export const setupWebSocket = (server: Server) => {
    const wss = new WebSocket.Server({ server });

    wss.on('connection', (ws, req) => {
        const userId = req.url?.split('=')[1]; // Extract userId from URL
        if (userId) {
            clients.set(userId, ws);
        }

        ws.on('close', () => {
            if (userId) clients.delete(userId);
        });
    });
};

export const notifyUser = (userId: string, notification: any) => {
    const ws = clients.get(userId);
    if (ws) {
        ws.send(JSON.stringify(notification));
    }
};
