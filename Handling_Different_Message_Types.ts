import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const { type, content } = JSON.parse(message);

        switch (type) {
            case 'chat':
                // Handle chat message
                console.log(`Chat message: ${content}`);
                broadcast(`Chat: ${content}`);
                break;
            case 'status':
                // Handle status updates
                console.log(`Status update: ${content}`);
                broadcast(`Status: ${content}`);
                break;
            default:
                console.log(`Unknown message type: ${type}`);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

// Broadcast messages to all connected clients
function broadcast(data) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
}

console.log('WebSocket server is running on ws://localhost:8080');
