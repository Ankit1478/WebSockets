import express from 'express';
import { WebSocketServer } from 'ws';

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        console.log(`Received: ${message}`);
        // Broadcast to all connected clients
        wss.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(`Broadcast: ${message}`);
            }
        });
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');


// Make Function to broadcast to all clients

import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });

const room = {};

// Function to send messages to all connected clients
function sendMessageToClients(message: string) {
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(message); // Send the message to each client
        }
    });
}

// Handle new WebSocket connections
wss.on("connection", (ws) => {
    console.log('New client connected');

    // Handle incoming messages from clients
    ws.on("message", (data: any) => {
        console.log(`Received message: ${data.toString()}`);
        sendMessageToClients(data.toString()); // Use the new function to send the message
    });

    // Handle client disconnection
    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

console.log('WebSocket server is running on ws://localhost:8080');
