let Vertices = [ 
    // Pos         UV
      -0.5,  0.5,  0.0, 1.0,
      -0.5, -0.5,  0.0, 0.0,
       0.5, -0.5,  1.0, 0.0,
       0.5,  0.5,  1.0, 1.0
];

let VertexFormat = [
    { name : 'aPosition', type : 'float', size : 2, offset : 0*4 },
    { name : 'aTexCoord', type : 'float', size : 2, offset : 2*4 }
];

let InstancedVertexFormat = [
    { name : 'aOffset', type : 'float', size : 1, offset : 0 },
]

function GetWebGLType(type) {
    switch(type) {
        case 'float' : {
            return { type : Core.Context.FLOAT, size : 4 };
            break;
        }
    }
}
  
class Buffer {
    constructor(shader) {
        this.VertexBuffer = Core.Context.createBuffer();
        this.VertexArrayObjectBuffer = Core.Context.createVertexArray();
        this.Shader = shader;
        this.CreateBuffer();
    }

    CreateBuffer() {
        this.Bind();
        Core.Context.bindBuffer(Core.Context.ARRAY_BUFFER, this.VertexBuffer);
        Core.Context.bufferData(Core.Context.ARRAY_BUFFER, new Float32Array(Vertices), Core.Context.STATIC_DRAW);
        
        VertexFormat.forEach((value,index,array)=>{
            let loc = Core.Context.getAttribLocation(this.Shader.Program, value.name);
            if(loc === -1)
            {
                console.error('VertexFormat doesnt match');
                Clear();
                return;
            }
            Core.Context.enableVertexAttribArray(loc);
            Core.Context.vertexAttribPointer(loc, value.size, GetWebGLType(value.type).type, false, Vertices.length, value.offset);  
        });

        this.Unbind();
    }

    Bind() {
        Core.Context.bindVertexArray(this.VertexArrayObjectBuffer);
    }

    Unbind() {
        Core.Context.bindVertexArray(null);
    }

    Clear() {
        Core.Context.deleteBuffer(this.VertexBuffer);
        Core.Context.deleteBuffer(this.VertexArrayObjectBuffer);
    }

}

class InstancedBuffer extends Buffer {
    constructor(shader) {
        super(shader);
        this.OffsetBuffer = Core.Context.createBuffer();
        this.Length = 0;
    }

    SetData(data) {
        if(data.length > 0)
        {
            this.Length = data.length;
            super.Bind();
            Core.Context.bindBuffer(Core.Context.ARRAY_BUFFER, this.OffsetBuffer);
            Core.Context.bufferData(Core.Context.ARRAY_BUFFER, new Float32Array(data), Core.Context.STATIC_DRAW);

            let stride = 0;
            InstancedVertexFormat.forEach((value,index,array)=>{
                stride += GetWebGLType(value.type).size;
            });

            InstancedVertexFormat.forEach((value,index,array)=>{
                let loc = Core.Context.getAttribLocation(this.Shader.Program, value.name);
                if(loc === -1)
                {
                    console.error('VertexFormat doesnt match');
                    Clear();
                    return;
                }
                Core.Context.enableVertexAttribArray(loc);
                Core.Context.vertexAttribPointer(loc, value.size, GetWebGLType(value.type).type, false, stride, value.offset);
                Core.Context.vertexAttribDivisor(loc, 1);
            });

            super.Unbind();
        }
    }

    Clear() {
        super.Clear();
        Core.Context.deleteBuffer(this.OffsetBuffer);
    }

}