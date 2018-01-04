"use strict";

class Material {
    constructor(shader) {
        this.Shader = shader;
        this.ClearAndSetParams();
    }

    ClearAndSetParams() {
        this.Parameters = [];
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