"use strict";

// TODO: make common classes

class Sprite {
    constructor(sizeX, sizeY, texture) {
        this.IsValid = false;
        this.Buffer = null;
        this.Material = null;
        this.SizeX = sizeX;
        this.SizeY = sizeY;
        this.X = 0;
        this.Y = 0;
        this.Texture = texture;

        ShaderProgramManager.Find('shader.vs','shader.fs', program => {
            this.Buffer = new Buffer(program);
            this.Material = new Material(program);
            this.IsValid = true;
            this.Material.SetParam('uProjection', Core.ProjectionMatrix);
            this.Material.SetParam('uScale', GetScale(this.SizeX,this.SizeY,1));
            this.Material.SetParam('uTranslation', GetTranslation(this.X,this.Y,0));
            this.Material.SetParam('uTex', this.Texture);
        });
    }

    SetPosition(x,y) {
        this.X = x;
        this.Y = y;
        if(this.IsValid == true) {
            this.Material.SetParam('uTranslation', GetTranslation(this.X,this.Y,0));
        }
    }

    SetScale(x,y) {
        this.SizeX = x;
        this.SizeY = y;
        if(this.IsValid == true) {
            this.Material.SetParam('uScale', GetScale(this.SizeX,this.SizeY,1));
        }
    }

    GetScale() {
        return { X : this.SizeX, Y : this.SizeY };
    }

    Draw() {
        if(this.IsValid == true) {
            Core.Context.enable(Core.Context.BLEND);
            Core.Context.blendFunc(Core.Context.SRC_ALPHA, Core.Context.ONE_MINUS_SRC_ALPHA);
            this.Buffer.Bind();
            this.Material.Bind();
            this.Buffer.Draw();
            Core.Context.disable(Core.Context.BLEND);
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
        this.X = 0;
        this.Y = 0;
    }

    SetData(data) {
        ShaderProgramManager.Find('shader.vs','shader.fs', program => {
            this.Buffer = new InstancedBuffer(program);
            this.Buffer.SetData(data);
            this.Material = new Material(program);
            this.Material.SetParam('uProjection', Core.ProjectionMatrix);
            this.Material.SetParam('uScale', GetScale(this.SizeX,this.SizeY,1));
            this.Material.SetParam('uTranslation', GetTranslation(this.X,this.Y,0));
            this.Material.SetParam('uTex', 'ground.png');
            this.IsValid = true;
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
