"use strict";

Core.InitWebGL('GameCanvas');
Core.InitWebSocket();
Core.InitControls();
ShaderProgramManager.Init();
TexManager.Init();

let TileSize = Core.Width/20; // 20x15

let buffer;
let material;

let sprite = new Sprite(TileSize/2,TileSize/2);
sprite.SetPosition(78,50);

let bg = new BackgroundSprite(TileSize,TileSize);


window.requestAnimationFrame(Frame);
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
                if(Core.PlayerIndex == status[0]) {
                    sprite.SetPosition(status[1],status[2]);
                }
            });
            Core.ServerStatus = null;
        }


        bg.Draw();
        sprite.Draw();

}

function ReplaceCharAt(string, index, char) {
    if(index >= string.length) return string;
    return string.substr(0,index) + char + string.substr(index+1);
}
