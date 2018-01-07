"use strict";

let ShaderProgramManager = {
    Shaders : [],
    Init : function() {
        this.Shaders = [];
    },

    Add : function(vertex, fragment, callback) {
        let shader = new ShaderProgram(vertex,fragment, (shader) => {

            let result = null;
            for(let i=0; i<this.Shaders.length; ++i) {
                if(this.Shaders[i].vs == vertex && this.Shaders[i].fs == fragment) {
                    result = this.Shaders[i];
                    break;
                }
            }    

            if(result == null) {
                this.Shaders.push({ vs: vertex, fs: fragment, program : shader});   
                if(callback && {}.toString.call(callback) === '[object Function]')
                {
                    callback(shader);     
                }
            } else {
                if(callback && {}.toString.call(callback) === '[object Function]')
                {
                    callback(result.program);     
                }
            }

        });
    },

    Find : function(vertex, fragment, callback) {
        let result = null;
        for(let i=0; i<this.Shaders.length; ++i) {
            if(this.Shaders[i].vs == vertex && this.Shaders[i].fs == fragment) {
                result = this.Shaders[i];
                break;
            }
        }

        if(result == null) {
            this.Add(vertex, fragment, callback);
        } else {
            if(callback && {}.toString.call(callback) === '[object Function]')
            {
                callback(result.program);     
            }
        }

    }
}

class Shader {

    constructor(filename, type, callback) {
        this.Name = filename;
        this.Source = "";
        this.Loaded = false;
        this.Callback = callback;
        this.Shader = null;
        this.Type = type;
        this.LoadShader();
    }

    LoadShader() {
        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = () => {
            if (xhttp.readyState == 4 && xhttp.status == 200) {
                this.Source = xhttp.responseText;   
                this.Loaded = true; 
                
                // Call callback function if defined
                if(this.CompileShader() && this.Callback && {}.toString.call(this.Callback) === '[object Function]')
                {
                    this.Callback(this);     
                }

            } 
        };
        xhttp.open('GET', 'shaders/' + this.Name, true);
        xhttp.send(); 
    }

    CompileShader() {
        switch(this.Type)
        {
            case Core.Context.VERTEX_SHADER:
            {
                this.Shader = Core.Context.createShader(Core.Context.VERTEX_SHADER);
                break;
            }
            case Core.Context.FRAGMENT_SHADER:
            {
                this.Shader = Core.Context.createShader(Core.Context.FRAGMENT_SHADER);
                break;
            }
            default:
            {
                console.log('Shader type not supported');
                return false;
            }
        }
        Core.Context.shaderSource(this.Shader, this.Source);
        Core.Context.compileShader(this.Shader);
        if(Core.Context.getShaderParameter(this.Shader, Core.Context.COMPILE_STATUS)) {
            return true;
        }
        console.log(Core.Context.getShaderInfoLog(this.Shader));
        ClearShader();
        return false;
    }

    Clear() {
        Core.Context.deleteShader(shader);
    }
}

class ShaderProgram {
    constructor(vertex,fragment, callback)
    {
        this.Program = null;
        this.Callback = callback;
        this.Shader = [];
        this.IsValid = false;
        this.Uniforms = [];
        
        this.Shader[0] = new Shader(vertex, Core.Context.VERTEX_SHADER, shader => {
            if(this.CheckIfComplete()) {
                this.CreateProgram();
            }
        });
        this.Shader[1] = new Shader(fragment, Core.Context.FRAGMENT_SHADER, shader => {
            if(this.CheckIfComplete()) {
                this.CreateProgram();
            }
        });
    }

    Bind() {
        Core.Context.useProgram(this.Program);
    }

    Unbind() {
        Core.Context.useProgram(0);
    }

    CreateProgram() {
        this.Program = Core.Context.createProgram();
        Core.Context.attachShader(this.Program, this.Shader[0].Shader);
        Core.Context.attachShader(this.Program, this.Shader[1].Shader);
        Core.Context.linkProgram(this.Program);
        if(Core.Context.getProgramParameter(this.Program, Core.Context.LINK_STATUS)) {
            this.IsValid = true;
            this.GetAllUniforms();
            if(this.Callback && {}.toString.call(this.Callback) === '[object Function]')
            {
                this.Callback(this);     
            }
            return true;
        }
        console.log(Core.Context.getProgramInfoLog(this.Program));
        ClearProgram();
        return false;
    }

    CheckIfComplete() {
        return this.Shader[0].Loaded === true && this.Shader[1].Loaded === true;
    }

    GetAllUniforms() {
        let UniformNumber = Core.Context.getProgramParameter(this.Program, Core.Context.ACTIVE_UNIFORMS);
        for(let i=0;i<UniformNumber;i++) {
            let Uniform = Core.Context.getActiveUniform(this.Program, i);
            this.Uniforms.push(Uniform);
        }
    }


    Clear() {
        this.Shader[0].ClearShader();
        this.Shader[1].ClearShader();
        Core.Context.deleteProgram(this.Program);
    }
}