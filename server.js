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

let AllPlayers = [];

let data = LoadMap('map1');
let game = new Game(data);

wss.on('connection', (ws,req) => {

    console.log('Client connected');

    // Set new player
    let player = new Player(ws,AllPlayers.length);
    AllPlayers.push(player);
    ws.ID = player.ID;

    if(!game.AddPlayer(player)) {
        console.log('lel');
        ws.close(); return;
    }
    
    game.StartGame();


    ws.on('close', () => { 
        if(AllPlayers[ws.ID].CurrentGame != null) {
            AllPlayers[ws.ID].CurrentGame.RemovePlayer(AllPlayers[ws.ID]);
        }
        console.log('Close ' + ws.ID); 
    });
    
    ws.on('message', data => {
        let pkg = data.substr(0,3);
        if(pkg == 'ACT') {
            //game.Players[ws.Index].Input.push(data.substr(3,data.length));
            AllPlayers[ws.ID].Input.push(data.substr(3,data.length));
        }
    });

    ws.on('error', () => console.log('errored'));

});

// game loop

let delta = 16.6;
setInterval(() => { 

    game.Update(delta / 1000);

}, delta);


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
