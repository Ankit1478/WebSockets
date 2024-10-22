import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        ws.send(`Echo: ${message}`); // Echo back the received message
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
