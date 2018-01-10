"use strict";

Core.InitWebGL('GameCanvas');
Core.InitWebSocket();
Core.InitControls();
ShaderProgramManager.Init();
TexManager.Init();

let TileSize = Core.Width/20; // 20x15

let bg = new BackgroundSprite(TileSize,TileSize);

let players = new Array(4);
for(let i=0; i<4;++i) {
    players[i] = new Sprite(TileSize/2,TileSize/2);
}

function Frame(time) {
    window.requestAnimationFrame(Frame);
     
        let actions = '00000';
        if(Core.IsKeyPressed(KeyboardKey.D)) {
            actions = ReplaceCharAt(actions,0,'1');
        }
        if(Core.IsKeyPressed(KeyboardKey.A)) {
            actions = ReplaceCharAt(actions,1,'1');
        }
        if(Core.IsKeyPressed(KeyboardKey.W)) {
            actions = ReplaceCharAt(actions,2,'1');
        }
        if(Core.IsKeyPressed(KeyboardKey.S)) {
            actions = ReplaceCharAt(actions,3,'1');
        }
        if(Core.IsKeyPressed(KeyboardKey.Space)) {
            actions = ReplaceCharAt(actions,4,'1'); // TODO: add delay
        }
        
        Core.ClientSocket.send('ACT' + actions);

        if(Core.ServerStatus != null)
        {
            let playersStatus = Core.ServerStatus.split('|');
            playersStatus.forEach(element => {
                
                let status = element.split(',');

                if(status[0] != 'undefined') {
                    players[status[0]].SetPosition(status[1],status[2]);
                }
                
            });
            Core.ServerStatus = null;

        }


        bg.Draw();
        players.forEach((player)=>{
            if(player != null) {
                player.Draw();
            }
        })
        //sprite.Draw();

}

function ReplaceCharAt(string, index, char) {
    if(index >= string.length) return string;
    return string.substr(0,index) + char + string.substr(index+1);
}
