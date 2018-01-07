const http = require('http');
const express = require('express');
const WebSocket = require('ws');

var app = express();
app.use(express.static('public'));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(8000);

const wss = new WebSocket.Server({ port: 8080 });

class Player {
    constructor(socket, index) {
        this.Index = index;
        this.Socket = socket;
        this.Input = [];
        this.CurrentPosition = [0,0];
        this.Velocity = [3,3];
    }
}

let Game = {
    Players : [],
    Size : 0
}

wss.on('connection', (ws,req) => {
    console.log('Client connected');
    if(Game.Size >= 4) { ws.close(); return; } // Max 4 players
    ws.Index = Game.Size++;

    let NewPlayer = new Player(ws, ws.Index);
    Game.Players.push(NewPlayer);

    ws.send('WLC|' + NewPlayer.Index); // Send player his index

    ws.on('close', () => { 
        delete Game.Players[ws.Input];
        Game.Players[ws.Input] = null;
        console.log('Close ' + ws.Index); 
    });
    
    ws.on('message', data => {
        let pkg = data.substr(0,3);
        if(pkg == 'ACT') {
            Game.Players[ws.Index].Input.push(data.substr(3,data.length));
        }
    });

    ws.on('error', () => console.log('errored'));

});

// game loop
setInterval(() => { 

    let update = 'UPD';    
    Game.Players.forEach( (player,index,array) => {
        if(player == undefined) return;

        player.Input.forEach((input)=>{
            let deltaPos = [0,0];
            if(input[0] == '1') {
                deltaPos[0] +=3;
            }
            if(input[1] == '1') {
                deltaPos[0] -=3;
            }
            if(input[2] == '1') {
                deltaPos[1] -=3;
            }
            if(input[3] == '1') {
                deltaPos[1] +=3;
            }
            player.CurrentPosition[0] += deltaPos[0];
            player.CurrentPosition[1] += deltaPos[1];
        });

        // Clear input
        player.Input = [];

        update += '|' + player.Socket.Index + ',' + player.CurrentPosition[0] + ',' + player.CurrentPosition[1];
    });

    Game.Players.forEach( (player,index,array) => {
        if(player !== null) 
        {
            try {
                player.Socket.send(update);
            } catch(err) {
                //console.log('Websocket error: %s', err); // WTF?
            }
        }
    });

}, 16.6);