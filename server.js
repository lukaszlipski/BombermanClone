const http = require('http');
const express = require('express');
const WebSocket = require('ws');
const fs = require('fs');
const Player = require('./player');
const Game = require('./game');

var app = express();
app.use(express.static('public'));

app.get('/', (req,res)=>{
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(8000);

const wss = new WebSocket.Server({ port: 8080 });

let data = LoadMap('map1');
let game = new Game(data);

wss.on('connection', (ws,req) => {

    console.log('Client connected');
    if(game.Size >= 4) { ws.close(); return; } // Max 4 players
    ws.Index = game.Size++;

    let NewPlayer = new Player(ws, ws.Index);
    NewPlayer.SetPosition(game.TileSize * game.Spawns[ws.Index].PosX, game.TileSize * game.Spawns[ws.Index].PosY);
    console.log(game.Spawns[ws.Index].PosX);
    game.Players.push(NewPlayer);

    ws.send('WLC|' + NewPlayer.Index); // Send player his index

    ws.send('MAP|' + data);

    ws.on('close', () => { 
        delete game.Players[ws.Input];
        game.Players[ws.Input] = null;
        console.log('Close ' + ws.Index); 
    });
    
    ws.on('message', data => {
        let pkg = data.substr(0,3);
        if(pkg == 'ACT') {
            game.Players[ws.Index].Input.push(data.substr(3,data.length));
        }
    });

    ws.on('error', () => console.log('errored'));

});

// game loop
setInterval(() => { 

    let update = 'UPD';    
    game.Players.forEach( (player,index,array) => {
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

    game.Players.forEach( (player,index,array) => {
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


function LoadMap(name) {
    let path = 'public/maps/' + name;
    if(!fs.existsSync(path))
    {
        console.log('Map ' + name + ' dont exists');
        return null;
    }
    let data = fs.readFileSync(path);
    return data;

}
