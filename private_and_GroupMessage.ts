import express from 'express';
import { WebSocketServer,WebSocket, OPEN } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });

interface CustomWebSocket extends WebSocket{
    id?:string,
    room?:any,
    targetId?:any
}


let room:{[key:string]:Set<CustomWebSocket>} = {};
let client:{[id:string]:CustomWebSocket} = {};

wss.on('connection', (ws:CustomWebSocket) => {
    
    const uniqueId = uuidv4();
    ws.id = uniqueId;
    ws.room = null;
    client[uniqueId] = ws;
    console.log(`New client connected ${uniqueId}`);

    ws.on('message', (message:any) => {
        console.log(`Received: ${message}`);
        clinetConnection(JSON.parse(message),ws);
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

function clinetConnection(data:any , ws:CustomWebSocket){
    const {type , roomId , message,targetId} = data;

    switch (type){
        case "join":
            if(!room[roomId]){
                room [roomId]= new Set();
            }
            room[roomId].add(ws);
            ws.room = roomId;
            ws.send(`Joined room: ${roomId}`);
            
        break;

        case "messsage":
            const roomMembers = room[roomId];
            if (roomMembers) {
            roomMembers.forEach((client) => {
            if (client !== ws && client.readyState === OPEN) {
                client.send(JSON.stringify({ type: 'roomMessage', message }));
            }
            });
      }
        break;

        case "privatemessage":
            const targetClient = client[targetId];
            if(targetClient && targetClient.readyState == OPEN){
                targetClient.send(
                    JSON.stringify({ type: 'privateMessage', message })
                  );
            }
        break;
    }
}

