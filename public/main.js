"use strict";

Core.InitWebGL('GameCanvas');
Core.InitWebSocket();

let Offets = [];

for(let x=0;x<800;x+=20) {
    for(let y=0;y<600;y+=20) {
        Offets.push(x,y);
    }
}

let buffer;
let material;

let shader = new ShaderProgram('shader.vs','shader.fs', program => {
    buffer = new InstancedBuffer(shader);
    buffer.SetData(Offets);

    material = new Material(shader);
    material.SetParam('uProjection', GetOrthoProjection(0 ,100 ,0 , 800 ,0 ,600));
});

Core.Context.viewport(0, 0, 800, 600);



window.requestAnimationFrame(Frame);
function Frame(time) {
    window.requestAnimationFrame(Frame);
    
    if(shader.IsValid) {

        buffer.Bind();
        material.Bind();
        Core.Context.drawArraysInstanced(buffer.Type, 0, 4, buffer.Length);

    }
}
