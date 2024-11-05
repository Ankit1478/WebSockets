import express from 'express';
import { WebSocketServer,WebSocket, OPEN } from 'ws';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const httpServer = app.listen(8080);
const wss = new WebSocketServer({ server: httpServer });


interface Player{
    id:string,
    x:any,
    y:any,
    room:any,
    size:number
}

interface CustomWebSocket extends WebSocket{
    id?:string,
    room?:any,
    player:Player
}

const room :{[key:string]:Set<CustomWebSocket>} = {};

wss.on("connection",(ws:CustomWebSocket)=>{
    const uniqueId =  uuidv4();
    ws.id = uniqueId;
    ws.room = null

    ws.on("message",(message:any)=>{
        const data = JSON.parse(message)
        playerConnection(data ,ws);
    })
})

function  playerConnection(data:any , ws:CustomWebSocket){
    const {type , x,y,roomId} = data;

    switch(type){
        case "join":
            joinRoom(roomId ,ws)
            break;
        
        case "movement":
            move(ws , x , y)
    }
}

function joinRoom(roomId:string , ws:CustomWebSocket){
    if(!room[roomId]){
        room[roomId] = new Set();
    }
    ws.player = {id:ws.id! , x:0 , y:0 , room:roomId ,size:20}
    room[roomId].add(ws);
    ws.send(JSON.stringify({ type: 'joinedRoom', roomId }));
}


function move(ws:CustomWebSocket , x:number , y:number){
    if(ws.player){

        if(!collions(ws,x,y)){
            ws.player.x = x;
            ws.player.y = y;
            const roomMembers = room[ws.player.room];
 
            if(roomMembers){
                roomMembers.forEach((client)=>{
                    if(client.readyState == WebSocket.OPEN){
                        client.send(
                            JSON.stringify({
                                type: 'playerMoved',
                                playerId: ws.id,
                                x: ws.player.x,
                                y:ws.player.y
                            })
                        )
                    }
                })
            }
        }
        else{
            ws.send(JSON.stringify({ type: 'collision', x, y }))
        }
    }
   
}

function collions(ws:CustomWebSocket , newX:number , newY:number){
    const roomMembers = room[ws.player!.room];

    for(let client of roomMembers){
        if(client !=ws && client.player){
            const dx = client.player.x - newX;
            const dy = client.player.y - newY;
            const dist = Math.sqrt(dx * dx + dy * dy)

            if(dist<ws.player.size + client.player.size){
                return true
            }
        }
        return false;
    }
    
}
