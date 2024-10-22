import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
    console.log('New client connected');
    
    // Start heartbeat mechanism
    const heartbeat = setInterval(() => {
        ws.send('ping'); // Send a heartbeat signal
    }, 30000); // Every 30 seconds

    ws.on('message', (message) => {
        // Handle incoming messages
        console.log(`Received: ${message}`);
    });

    ws.on('close', () => {
        clearInterval(heartbeat); // Clear heartbeat on disconnect
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
