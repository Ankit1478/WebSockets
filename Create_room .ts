import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });


// Create a chat room 
const room:any ={};

function chat(data:any , ws:WebSocket){
    const {type , roomId , text} = data;
    if(type=="join"){
        if(!room[roomId]){
            room[roomId] = new Set();
        }
        //add client to Room 
        room[roomId].add(ws);
    }
     if(type=='message'){
        room[roomId].forEach((client:any)=>{
            if(client.readyState === client.OPEN){
                client.send(text);
            }
        })
    }
}

//@ts-ignore
wss.on("connection",(ws)=>{
    ws.on("message",(data:any)=>{
        chat(JSON.parse(data) , ws)
    })
})

console.log('WebSocket server is running on ws://localhost:8080');
