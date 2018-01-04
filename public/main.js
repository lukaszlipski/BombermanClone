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

let shader = new ShaderProgram('shader.vs','shader.fs', program => {
    buffer = new InstancedBuffer(shader);
    buffer.SetData(Offets);

    shader.Bind();
    Core.Context.uniformMatrix4fv(Core.Context.getUniformLocation(shader.Program, 'uProjection'), false, new Float32Array(GetOrthoProjection(0 ,100 ,0 , 800 ,0 ,600)));
    Core.Context.uniformMatrix4fv(Core.Context.getUniformLocation(shader.Program, 'uTranslation'), false, new Float32Array(GetTranslation(0,0,0)));
});

Core.Context.viewport(0, 0, 800, 600);



window.requestAnimationFrame(Frame);
function Frame(time) {
    window.requestAnimationFrame(Frame);
    
    if(shader.IsValid) {

        shader.Bind();
        buffer.Bind();
        // Core.Context.bindVertexArray(Vao);
        // Core.Context.drawArrays(Core.Context.TRIANGLES, 0, 3);
        // Core.Context.drawElementsInstanced(Core.Context.TRIANGLES, 6, Core.Context.UNSIGNED_BYTE, 0, 3);
        Core.Context.drawArraysInstanced(buffer.Type, 0, 4, buffer.Length);

    }
}
