"use strict";

Core.InitWebGL('GameCanvas');
Core.InitWebSocket();
Core.InitControls();
ShaderProgramManager.Init();
TexManager.Init();

let TileSize = Core.Width/20; // 20x15

let Offets = [];

for(let x=0; x<Core.Width; x+=TileSize) {
    for(let y=0; y<Core.Height; y+=TileSize) {
        Offets.push(x, y);
    }
}

let buffer;
let material;

let sprite = new Sprite(TileSize/2,TileSize/2);
sprite.SetPosition(78,50);

ShaderProgramManager.Find('shader.vs','shader.fs', program => {
    
    buffer = new InstancedBuffer(program);
    buffer.SetData(Offets);

    material = new Material(program);
    material.SetParam('uProjection', GetOrthoProjection(0 ,100 ,0 , Core.Width ,0 ,Core.Height));
    material.SetParam('uScale', GetScale(TileSize,TileSize,1));
    //material.SetParam('uTranslation', GetTranslation(TileSize,TileSize,0));
    material.SetParam('uTex2', 'ground.png');

 })



window.requestAnimationFrame(Frame);
function Frame(time) {
    window.requestAnimationFrame(Frame);

        let actions = '0000';
        if(Core.IsKeyPressed(KeyboardKey.D))
        {
            actions = ReplaceCharAt(actions,0,'1');
        }
        if(Core.IsKeyPressed(KeyboardKey.A))
        {
            actions = ReplaceCharAt(actions,1,'1');
        }
        if(Core.IsKeyPressed(KeyboardKey.W))
        {
            actions = ReplaceCharAt(actions,2,'1');
        }
        if(Core.IsKeyPressed(KeyboardKey.S))
        {
            actions = ReplaceCharAt(actions,3,'1');
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

        buffer.Bind();
        material.Bind();
        buffer.Draw();

        sprite.Draw();

}

function ReplaceCharAt(string, index, char) {
    if(index >= string.length) return string;
    return string.substr(0,index) + char + string.substr(index+1);
}
