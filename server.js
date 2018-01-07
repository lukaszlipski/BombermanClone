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

wss.on('connection', ws => {
    console.log('connection');

    ws.send('hi');

    ws.on('close', () => {
        console.log('close');
    });
    
    ws.on('message', data => {
        console.log(data);
    });

    ws.on('error', () => console.log('errored'));
});
