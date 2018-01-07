"use strict";

class Sprite {
    constructor(sizeX, sizeY) {
        this.IsValid = false;
        this.Buffer = null;
        this.Material = null;
        this.SizeX = sizeX;
        this.SizeY = sizeY;
        this.X = 0;
        this.Y = 0;

        ShaderProgramManager.Find('shader.vs','shader.fs', program => {
            this.Buffer = new Buffer(program);
            this.Material = new Material(program);
            this.IsValid = true;
            this.Material.SetParam('uProjection', Core.ProjectionMatrix);
            this.Material.SetParam('uScale', GetScale(this.SizeX,this.SizeY,1));
            this.Material.SetParam('uTranslation', GetTranslation(this.X,this.Y,0));
        });
    }

    SetPosition(x,y) {
        this.X = x;
        this.Y = y;
        if(this.IsValid == true) {
            this.Material.SetParam('uTranslation', GetTranslation(this.X,this.Y,0));
        }
    }

    Draw() {
        if(this.IsValid == true) {
            this.Buffer.Bind();
            this.Material.Bind();
            this.Buffer.Draw();
        }
    }
}

class BackgroundSprite {
    constructor(sizeX, sizeY) {
        this.IsValid = false;
        this.Buffer = null;
        this.Material = null;
        this.SizeX = sizeX;
        this.SizeY = sizeY;
        this.Map = null;
        this.X = 0;
        this.Y = 0;

        Core.MapLoadedCb = (map) => {
            this.Map = map;
            ShaderProgramManager.Find('shader.vs','shader.fs', program => {
                this.Buffer = new InstancedBuffer(program);
                this.ProcessMap();
                this.Material = new Material(program);
                this.IsValid = true;
                this.Material.SetParam('uProjection', Core.ProjectionMatrix);
                this.Material.SetParam('uScale', GetScale(this.SizeX,this.SizeY,1));
                this.Material.SetParam('uTranslation', GetTranslation(this.X,this.Y,0));
                this.Material.SetParam('uTex', 'ground.png');
            });

        }

    }

    SetPosition(x,y) {
        this.X = x;
        this.Y = y;
        if(this.IsValid == true) {
            this.Material.SetParam('uTranslation', GetTranslation(this.X,this.Y,0));
        }
    }

    Draw() {
        if(this.IsValid == true) {
            this.Buffer.Bind();
            this.Material.Bind();
            this.Buffer.Draw();
        }
    }

    ProcessMap() {
        let y = 0;
        let x = 0;
        let offsets = [];
        for(let i=0;i<this.Map.length; ++i) {

            if(this.Map[i] == '\r') {
                continue;
            }
            if(this.Map[i] == '\n') {
                y++;
                x = 0;
                continue;
            }

            offsets.push(x++ * this.SizeX);
            offsets.push(y * this.SizeY);
            
            switch(this.Map[i]) {
                case '9':
                case '0': {
                    offsets.push(0);
                    break;
                }
                case '1': {
                    offsets.push(1);
                    break;
                }
                default: {
                    console.log('Bad number in map: ' + this.Map[i]);
                    offsets.push(0);
                }
            }

        }
        this.Buffer.SetData(offsets);
    }
}