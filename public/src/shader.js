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

    ClearShader() {
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

    ClearProgram() {
        this.Shader[0].ClearShader();
        this.Shader[1].ClearShader();
        Core.Context.deleteProgram(this.Program);
    }
}