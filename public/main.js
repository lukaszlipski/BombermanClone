"use strict";

Core.InitWebGL('GameCanvas');
Core.InitWebSocket();
Core.InitControls();

let TileSize = Core.Width/40; // 40x30

let Offets = [];

for(let x=0; x<Core.Width - 2*TileSize; x+=TileSize) {
    for(let y=0; y<Core.Height - 2*TileSize; y+=TileSize) {
        Offets.push(x, y);
    }
}

let buffer;
let material;

let shader = new ShaderProgram('shader.vs','shader.fs', program => {
    buffer = new InstancedBuffer(shader);
    buffer.SetData(Offets);

    material = new Material(shader);
    material.SetParam('uProjection', GetOrthoProjection(0 ,100 ,0 , Core.Width ,0 ,Core.Height));
    material.SetParam('uScale', GetScale(TileSize,TileSize,1));
    material.SetParam('uTranslation', GetTranslation(TileSize,TileSize,0));
});

window.requestAnimationFrame(Frame);
function Frame(time) {
    window.requestAnimationFrame(Frame);
    
    if(shader.IsValid) {

        buffer.Bind();
        material.Bind();
        Core.Context.drawArraysInstanced(buffer.Type, 0, 4, buffer.Length);

    }
}
