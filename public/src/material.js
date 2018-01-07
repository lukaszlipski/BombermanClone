"use strict";

class Material {
    constructor(shader) {
        this.Shader = shader;
        this.ClearAndSetParams();
        this.TextureCount = 0;
    }

    ClearAndSetParams() {
        this.Parameters = [];
        this.TextureCount = 0;
        this.Shader.Uniforms.forEach((value, index, array)=>{
            let location = Core.Context.getUniformLocation(this.Shader.Program, value.name);
            switch(value.type) {
                case Core.Context.FLOAT_MAT4: {
                    this.Parameters.push(new MatrixParam(value.name, location));
                    break;
                }
                case Core.Context.FLOAT: {
                    this.Parameters.push(new FloatParam(value.name, location));
                    break;
                }
                case Core.Context.FLOAT_VEC4: {
                    this.Parameters.push(new Vec3Param(value.name, location));
                    break;
                }
                case Core.Context.SAMPLER_2D: {
                    this.Parameters.push(new TexParam(value.name, location, this.TextureCount++));
                    break;
                }
                default:
                {
                    console.log('Unsupported uniform type');
                }
            }
        });
    }

    SetParam(name,value) {
        this.Parameters.forEach((val,index)=>{
            if(val.Name == name) {
                val.SetValue(value);
            }
        });
    }

    Bind() {
        this.Shader.Bind();
        this.Parameters.forEach((value)=>{
            value.Bind();
        });
    }

}

class IParam {
    constructor(name, location) {
        this.Name = name;
        this.Location = location;
        this.Value = null;
    }
}


class MatrixParam extends IParam {
    constructor(name, location) {
        super(name, location);
        this.Value = GetIdentityMatrix();
    }
    
    SetValue(value) {
        if(Array.isArray(value) && value.length == 16) {
            this.Value = [];
            this.Value = value;
        } else {
            console.log('Bad value for parameter ' + this.Name);
        }

    }

    Bind() {
        Core.Context.uniformMatrix4fv(this.Location, false, new Float32Array(this.Value));
    }

}

class FloatParam extends IParam {
    constructor(name, location) {
        super(name, location);
        this.Value = 0;
    }
    
    SetValue(value) {
        if(!Array.isArray(value)) {
            this.Value = value;
        } else {
            console.log('Bad value for parameter ' + this.Name);
        }

    }

    Bind() {
        Core.Context.uniform1f(this.Location, this.Value);
    }

}

class Vec3Param extends IParam {
    constructor(name, location) {
        super(name, location);
        this.Value = [0,0,0,0];
    }
    
    SetValue(value) {
        if(Array.isArray(value) && value.length == 4) {
            this.Value = [];
            this.Value = value;
        } else {
            console.log('Bad value for parameter ' + this.Name);
        }

    }

    Bind() {
        Core.Context.uniform4f(this.Location, this.Value[0], this.Value[1], this.Value[2], this.Value[3]);
    }

}

class TexParam extends IParam {
    constructor(name, location, index) {
        super(name, location);
        this.Value = null;
        this.Index = index;
        this.CurrentTextureName = '';
        this.SetValue('dummy.png');
    }
    
    SetValue(value) {
        this.CurrentTextureName = value;
        TexManager.FindImg(value,(loadedTexture)=>{
            if(value == this.CurrentTextureName) {
                this.Value = loadedTexture;
            }
            console.log(value);
        });
    }

    Bind() {
        if(this.Value == null) { return; }
        Core.Context.activeTexture(Core.Context.TEXTURE0 + this.Index);
        Core.Context.uniform1i(this.Location, this.Index);
        Core.Context.bindTexture(Core.Context.TEXTURE_2D, this.Value);
    }

}