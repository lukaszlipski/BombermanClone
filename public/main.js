"use strict";

// Initialize gl context and client socket
//var gl = InitWebGL();
//var ClientSocket = InitWebSocket();

Core.InitWebGL('GameCanvas');
Core.InitWebSocket();

let VertexBuffer = Core.Context.createBuffer();
let Vao = Core.Context.createVertexArray();

let Vertices = [ 
    -0.5,  0.5,
    -0.5, -0.5,
     0.5, -0.5
];

let shader = new ShaderProgram('shader.vs','shader.fs', program => {

    Core.Context.bindVertexArray(Vao);
    Core.Context.bindBuffer(Core.Context.ARRAY_BUFFER, VertexBuffer);
    Core.Context.bufferData(Core.Context.ARRAY_BUFFER, new Float32Array(Vertices), Core.Context.STATIC_DRAW);
    Core.Context.enableVertexAttribArray(Core.Context.getAttribLocation(shader.Program, "aPosition"));
    Core.Context.vertexAttribPointer(Core.Context.getAttribLocation(shader.Program, "aPosition"), 2, Core.Context.FLOAT, false, 0, 0);
    Core.Context.bindVertexArray(null);
    
});

Core.Context.viewport(0, 0, 800, 600);

window.requestAnimationFrame(Frame);
function Frame(time) {
    window.requestAnimationFrame(Frame);
    
    if(shader.IsValid) {

        shader.Bind();
        Core.Context.bindVertexArray(Vao);
        Core.Context.drawArrays(Core.Context.TRIANGLES, 0, 3);

    }
}
