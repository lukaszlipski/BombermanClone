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