const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const publicPath = './public';

var Server = http.createServer((req,res) => {
    
    let CurrentPath = req.url;
    if(CurrentPath === '\\' || CurrentPath === '/')
    {
        CurrentPath = 'index.html';
    }

    CurrentPath = path.join(publicPath,CurrentPath);

    // Check for file
    if(!fs.existsSync(CurrentPath))
    {
        console.log('File ' + CurrentPath + ' dont exists');
        res.end();
        return;
    }

    fs.readFile(CurrentPath, (err,data) => {
        if(err)
        {
            console.log(err);
            res.end();
            return;
        }
        
        res.writeHead(200);
        res.write(data);
        res.end();
        
    });

    

});

Server.listen(8000);

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
});
