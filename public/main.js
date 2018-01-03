"use strict";

Core.InitWebGL('GameCanvas');
Core.InitWebSocket();

let Offets = [
    0.0, 0.15, 0.3
];

let buffer;

let shader = new ShaderProgram('shader.vs','shader.fs', program => {

    buffer = new InstancedBuffer(shader);
    buffer.SetData(Offets);

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
        Core.Context.drawArraysInstanced(Core.Context.TRIANGLE_FAN, 0, 4, 3);

    }
}
